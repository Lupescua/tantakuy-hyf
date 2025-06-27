import dbConnect from '@/utils/dbConnects';
import Competition from '../models/Competition';
import { getUserFromRequest } from '@/utils/auth';

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
