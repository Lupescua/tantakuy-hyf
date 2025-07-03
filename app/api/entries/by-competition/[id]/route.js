import dbConnect from '@/utils/dbConnects';
import Entry from '@/app/api/models/Entry';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id: competitionId } = await params;

  try {
    await dbConnect();

    const entries = await Entry.find({ competition: competitionId }).select(
      'imageUrl',
    );

    return NextResponse.json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
