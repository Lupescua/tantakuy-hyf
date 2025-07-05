import dbConnect from '@/utils/dbConnects';
import Competition from '../../models/Competition';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get('companyId');

  if (!companyId) {
    return NextResponse.json({ error: 'Missing companyId' }, { status: 400 });
  }

  try {
    const competitions = await Competition.find({ company: companyId }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ success: true, data: competitions });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to fetch competitions' },
      { status: 500 },
    );
  }
}
