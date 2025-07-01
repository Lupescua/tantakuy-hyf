import dbConnect from '@/utils/dbConnects';
import Competition from '../../models/Competition';
import { isValidObjectId } from 'mongoose';

export async function GET(request, { params }) {
  await dbConnect();

  const { id } = params;

  if (!isValidObjectId(id)) {
    return new Response(JSON.stringify({ error: 'Invalid competition ID' }), {
      status: 400,
    });
  }

  try {
    const comp = await Competition.findById(id);
    if (!comp) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(comp), { status: 200 });
  } catch (error) {
    console.error('Error fetching competition:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
