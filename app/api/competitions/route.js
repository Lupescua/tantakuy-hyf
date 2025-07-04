import dbConnect from '@/utils/dbConnects';
import Competition from '../models/Competition';
import { getUserFromCookie } from '@/utils/server/auth';
import { verifyToken } from '@/utils/jwt.js';

export async function GET() {
  await dbConnect();
  try {
    const competitions = await Competition.find().sort({ createdAt: -1 });
    if(competitions){
      return Response.json({data: competitions, success: true}, {status: 200});
    }
    
  } catch (error) {
    console.error('Error fetch competitions:', error);
    return Response.json(
      { error: `Failed to fetch competition ${error.messsage}` },
      { status: 401 },
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
      { status: 401 },
    );
  }
}
