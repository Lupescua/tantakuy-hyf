import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnects';
import Entry from '@/app/api/models/Entry';
import Company from '@/app/api/models/Company';
import Competition from '../../models/Competition';
import { isValidObjectId } from 'mongoose';

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
          select: 'name', // grab only the company’s name
        },
      })
      .lean();

    // 2) Map into the shape your frontend expects:

    // drop any with missing competition
    const good = entries.filter((e) => e.competition);
    const data = good.map((e) => ({
      id: e._id,
      title: e.competition.title,
      company: e.competition.company?.name || 'Ukendt',
      likes: e.votes,
      shares: e.shares,
      saved: 0,
      imageUrl: e.imageUrl,
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Error in profile stats route:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
