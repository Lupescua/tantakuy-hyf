import dbConnect from '@/utils/dbConnects';
import Competition from '../models/Competition';
import { getUserFromRequest } from '@/utils/server/auth';
import { verifyToken } from '@/utils/jwt.js';

export async function GET() {
  await dbConnect();
  const competitions = await Competition.find().sort({ createdAt: -1 });
  return Response.json(competitions);
}

export async function POST(req) {
  try {
    await dbConnect();

    const user = await getUserFromRequest(req);
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
      { status: 401 },
    );
  }
}
