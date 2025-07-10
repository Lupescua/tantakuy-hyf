import dbConnect from '@/utils/dbConnects';
import Competition from '../models/Competition';
import Entry from '../models/Entry';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt.js';

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase();
  const companyId = searchParams.get('companyId');
  const sort = searchParams.get('sort') || 'popularity';

  try {
    // Fetch competitions + populate company to allow searching by name
    let competitions = await Competition.find()
      .populate('company', 'companyName') // get company name only
      .sort({ createdAt: -1 }) // temp fallback; re-sort below
      .lean(); // for easier filtering

    // Filter by company ID
    if (companyId) {
      competitions = competitions.filter(
        (c) => c.company?._id?.toString() === companyId,
      );
    }

    // Filter by search (title or company name)
    if (search) {
      competitions = competitions.filter((c) => {
        const titleMatch = c.title?.toLowerCase().includes(search);
        const companyMatch = c.company?.companyName
          ?.toLowerCase()
          .includes(search);
        return titleMatch || companyMatch;
      });
    }

    // Count votes or entries for popularity (simplified)
    if (sort === 'popularity') {
      const compIds = competitions.map((c) => c._id);
      const counts = await Entry.aggregate([
        { $match: { competition: { $in: compIds } } },
        { $group: { _id: '$competition', count: { $sum: 1 } } },
      ]);

      const countMap = {};
      counts.forEach((item) => {
        countMap[item._id.toString()] = item.count;
      });

      competitions.forEach((c) => {
        c.entryCount = countMap[c._id.toString()] || 0;
      });

      competitions.sort((a, b) => b.entryCount - a.entryCount);
    } else if (sort === 'date') {
      competitions.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    return NextResponse.json(
      { data: competitions, success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching competitions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competitions' },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const user = await getUserFromCookie();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    verifyToken(req);

    const competitionData = await req.json();

    const created = await Competition.create(competitionData);

    return Response.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating competition:', error);
    return Response.json(
      { error: 'Failed to create competition' },
      { status: 400 },
    );
  }
}
