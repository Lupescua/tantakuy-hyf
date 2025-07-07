// app/api/competitions/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnects';
import Competition from '../../models/Competition';
import { isValidObjectId } from 'mongoose';

export async function GET(request /* ← only one arg now */) {
  /* ---------------------------------------------------------- *
   * 1) Extract :id from the URL manually to avoid Next bug      *
   * ---------------------------------------------------------- */
  const pathname = new URL(request.url).pathname; // e.g. /api/competitions/64f…
  const id = pathname.split('/').pop(); // "64f…"

  // 1-bis) Validate ID format
  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: 'Invalid competition ID' },
      { status: 400 },
    );
  }

  /* ---------------------------------------------------------- *
   * 2) Connect BEFORE any model access                         *
   * ---------------------------------------------------------- */
  await dbConnect();

  try {
    /* -------------------------------------------------------- *
     * 3) Fetch the document                                    *
     * -------------------------------------------------------- */
    const comp = await Competition.findById(id);
    if (!comp) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    /* -------------------------------------------------------- *
     * 4) Return                                                *
     * -------------------------------------------------------- */
    return NextResponse.json(comp);
  } catch (err) {
    console.error('Error fetching competition:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  /* ---------------------------------------------------------- *
   * 1) Extract :id from the URL manually to avoid Next bug      *
   * ---------------------------------------------------------- */
  const pathname = new URL(request.url).pathname;
  const id = pathname.split('/').pop();

  // 1-bis) Validate ID format
  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: 'Invalid competition ID' },
      { status: 400 },
    );
  }

  /* ---------------------------------------------------------- *
   * 2) Connect BEFORE any model access                         *
   * ---------------------------------------------------------- */
  await dbConnect();

  try {
    /* -------------------------------------------------------- *
     * 3) Delete the document                                   *
     * -------------------------------------------------------- */
    const deleted = await Competition.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    /* -------------------------------------------------------- *
     * 4) Return success                                        *
     * -------------------------------------------------------- */
    return NextResponse.json({
      success: true,
      message: 'Deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting competition:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
