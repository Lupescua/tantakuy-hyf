
import dbConnect from '@/utils/dbConnects';
import Competition from '../../models/Competition';
import mongoose from 'mongoose';


export async function GET(request, { params }) {
  const { id } = await params

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: 'Invalid or missing competition ID' }, { status: 400 });
  }

  try {
    await dbConnect();

    const competition = await Competition.findById(id);
    if (!competition) {
      return Response.json({ error: 'Competition not found' }, { status: 404 });
    }

    return Response.json(competition);
  } catch (err) {
    console.error('Error fetching competition:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
