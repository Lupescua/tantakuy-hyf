import dbConnect from '@/utils/dbConnects';
import Competition from '../../models/Competition';

export async function GET(_, { params }) {
  try {
    await dbConnect();

    const { params } = context;
    const comp = await Competition.findById(params.id);

    if (!comp) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    return Response.json(comp);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
