import dbConnect from '@/utils/dbConnects';
import Competition from '../../models/Competition';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  console.log('this is serachPreaam', searchParams);
  const competitionId = searchParams.get('id');
  console.log('give me id', competitionId);
  try {
    await dbConnect();

    const comp = await Competition.findById(competitionId);

    if (!comp) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    return Response.json(comp);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
