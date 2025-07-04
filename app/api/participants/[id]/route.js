import Participant from '@/app/api/models/Participant';
import dbConnect from '@/utils/dbConnects';
import { AppError } from '@/utils/errorHandler';
import { NextResponse } from 'next/server';

export async function GET(_req, { params }) {
  try {
    await dbConnect();
    const id = params.id;

    if (!id) {
      throw new AppError('Participant ID is required', 400);
    }

    const participant = await Participant.findById(id).select('-password');

    if (!participant) {
      throw new AppError('Participant not found', 404);
    }

    return NextResponse.json({ participant });
  } catch (error) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status },
    );
  }
}
