import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnects';
import Entry from '@/app/api/models/Entry';
import { Types, isValidObjectId } from 'mongoose';

export async function GET(request) {
  const pathname = new URL(request.url).pathname;
  const competitionId = pathname.split('/').pop();

  if (!isValidObjectId(competitionId)) {
    return NextResponse.json(
      { success: false, message: 'Invalid competitionId' },
      { status: 400 },
    );
  }

  // parse ?limit= & ?skip=
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const skip = parseInt(url.searchParams.get('skip') || '0', 10);

  try {
    await dbConnect();

    // this is an attempt at creating a trend algorithm, compute trendingScore = votes / hoursOld
    const now = new Date();
    const pipeline = [
      { $match: { competition: new Types.ObjectId(competitionId) } },

      // 2) join on Participant collection
      {
        $lookup: {
          from: 'participants', // your MongoDB collection name
          localField: 'participant', // Entry.participant
          foreignField: '_id', // Participant._id
          as: 'participantArr',
        },
      },

      // 3) unwind that array to a single object
      { $unwind: '$participantArr' },

      // 4) copy just the fields we need onto `participant`
      {
        $addFields: {
          'participant.userName': '$participantArr.userName',
          'participant.avatarUrl': '$participantArr.avatarUrl',
        },
      },

      // 5) the existing trending‐score calculation
      {
        $addFields: {
          hoursOld: {
            $divide: [{ $subtract: [now, '$createdAt'] }, 1000 * 60 * 60],
          },
        },
      },
      {
        $addFields: {
          trendingScore: {
            $cond: [
              { $gt: ['$hoursOld', 0] },
              { $divide: ['$votes', '$hoursOld'] },
              '$votes',
            ],
          },
        },
      },

      // 6) sort, skip and limit
      { $sort: { trendingScore: -1 } },
      { $skip: skip },
      { $limit: limit },

      // 7) project only the fields your client needs:
      {
        $project: {
          imageUrl: 1,
          caption: 1,
          votes: 1,
          createdAt: 1,
          participant: 1,
        },
      },
    ];

    const entries = await Entry.aggregate(pipeline);

    return NextResponse.json({ success: true, data: entries });
  } catch (err) {
    console.error('Error in by-competition route:', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
