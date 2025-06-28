import dbConnect from '@/utils/dbConnects';
import Competition from '../models/Competition';
import { verifyToken } from '@/utils/server/auth';

export async function GET() {
  await dbConnect();
  const competitions = await Competition.find().sort({ createdAt: -1 });
  return Response.json(competitions);
}

export async function POST(req) {
  try {
    await dbConnect();
    verifyToken(req);

    const competitionData = await req.json();

    const created = await Competition.create(competitionData);
    return Response.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating competition:', error);
    return Response.json(
      { error: 'Failed to create competition' },
      { status: 401 },
    );
  }
}
