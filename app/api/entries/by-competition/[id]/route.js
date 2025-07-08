import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnects';
import Entry from '@/app/api/models/Entry';
import { Types, isValidObjectId } from 'mongoose';

export async function GET(req, { params }) {
  const competitionId = params.id;
  if (!isValidObjectId(competitionId)) {
    return NextResponse.json(
      { success: false, message: 'Invalid competitionId' },
      { status: 400 },
    );
  }

  // parse ?limit= & ?skip=
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const skip = parseInt(url.searchParams.get('skip') || '0', 10);

  try {
    await dbConnect();

    // this is an attempt at creating a trend algorithm, compute trendingScore = votes / hoursOld
    const now = new Date();
    const pipeline = [
      { $match: { competition: new Types.ObjectId(competitionId) } },
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
      { $sort: { trendingScore: -1 } },
      { $skip: skip },
      { $limit: limit },
      // project only the fields your client needs:
      {
        $project: {
          imageUrl: 1,
          caption: 1,
          participant: 1,
          votes: 1,
          createdAt: 1,
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
