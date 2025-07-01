import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnects';
import Competition from '../../models/Competition';
import { isValidObjectId } from 'mongoose';

export async function GET(request, { params }) {
  const { id } = params;

  // 1) Validate ID format
  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: 'Invalid competition ID'},
      { status: 400 },
    );
    // return new Response(JSON.stringify({ error: 'Invalid competition ID' }), {
    //   status: 400,
    // });
  }

  // 2) Connect (this must complete before any model calls)
  await dbConnect();

  try {
    // 3) Fetch & lean
    const comp = await Competition.findById(id);
    if (!comp) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
      });
    }

    // 4) Return the doc
    return NextResponse.json(comp);
  } catch (error) {
    console.error('Error fetching competition:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
