import dbConnect from '../../../utils/dbConnects';
import Entry from '../models/Entry';
import mongoose from 'mongoose';
import { withAuth } from '@/utils/authMiddleware';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const competitionId = searchParams.get('competitionId');

  if (!competitionId) {
    return new Response(
      JSON.stringify({ error: 'competitionId query parameter is required' }),
      { status: 400 },
    );
  }

  if (!mongoose.Types.ObjectId.isValid(competitionId)) {
    return new Response(JSON.stringify({ error: 'Invalid competitionId' }), {
      status: 400,
    });
  }

  try {
    const entries = await Entry.find({ competition: competitionId }).sort({
      createdAt: -1,
    });

    return new Response(JSON.stringify(entries), { status: 200 });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch entries' }), {
      status: 500,
    });
  }
}

async function createEntry(req, { params, user }) {
  await dbConnect();

  try {
    const body = await req.json();
    const { competition, imageUrl, caption } = body;

    if (!competition || !imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Competition and imageUrl are required' }),
        { status: 400 },
      );
    }

    const newEntry = await Entry.create({
      competition,
      participant: user.id,
      imageUrl,
      caption,
    });

    return new Response(JSON.stringify(newEntry), { status: 201 });
  } catch (error) {
    console.error('Error creating entry:', error);
    return new Response(JSON.stringify({ error: 'Failed to create entry' }), {
      status: 500,
    });
  }
}

export const POST = withAuth(createEntry);
