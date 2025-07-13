import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnects';
import Entry from '@/app/api/models/Entry';
import Company from '@/app/api/models/Company';
import Competition from '../../models/Competition';
import { isValidObjectId } from 'mongoose';
import Vote from '../../models/Vote';

export async function GET(request, context) {
  await dbConnect();

  const params = await context.params;
  const userId = params.id;

  if (!isValidObjectId(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    // 1) Find all entries this user submitted
    const entries = await Entry.find({ participant: userId })
      .populate({
        path: 'competition',
        select: 'title company', // only these two fields from Competition
        populate: {
          path: 'company',
          select: 'companyName', // grab only the company’s name
        },
      })
      .lean();

    // 2) Map into the shape your frontend expects:

    // drop any with missing competition
    const good = entries.filter((e) => e.competition);

    // 3) For each entry, count votes and read shares
    const data = await Promise.all(
      good.map(async (e) => {
        const voteCount = await Vote.countDocuments({ entry: e._id });
        return {
          id: e._id.toString(),
          title: e.competition.title,
          company: e.competition.company?.companyName || 'Ukendt',
          likes: voteCount, // real vote total
          shares: e.shares || 0, // 0 if undefined
          saved: 0,
          imageUrl: e.imageUrl,
        };
      }),
    );

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Error in profile stats route:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
