import dbConnect from '../../../../utils/dbConnects';
import Entry from '../../models/Entry';
import { withAuth } from '../../../../utils/authMiddleware';
import { deleteEntryById } from '@/app/services/entryServices';

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const entry = await Entry.findById(params.id).populate('participant');

    if (!entry) {
      return new Response(JSON.stringify({ error: 'Entry not found' }), {
        status: 404,
      });
    }

    const formatted = {
      id: entry._id,
      title: entry.caption || 'Untitled Entry',
      username: entry.participant?.name || 'Unknown',
      imageUrl: entry.imageUrl || 'https://via.placeholder.com/600x400',
      description: entry.description || '',
      votes: entry.votes || 0,
    };

    return new Response(JSON.stringify(formatted), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching entry:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}

export async function PATCH(req, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    const entry = await Entry.findByIdAndUpdate(
      id,
      { $inc: { votes: 1 } },
      { new: true },
    );

    if (!entry) {
      return new Response(JSON.stringify({ error: 'Entry not found' }), {
        status: 404,
      });
    }

    const formatted = {
      id: entry._id,
      title: entry.caption || 'Untitled Entry',
      username: entry.participant?.name || 'Unknown',
      imageUrl: entry.imageUrl || 'https://via.placeholder.com/600x400',
      description: entry.description || '',
      votes: entry.votes || 0,
    };

    return new Response(JSON.stringify(formatted), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error voting entry:', error);
    return new Response(JSON.stringify({ error: 'Failed to vote' }), {
      status: 500,
    });
  }
}

async function deleteEntryRoute(req, { params, user }) {
  const entryId = params.id;

  if (!entryId) {
    return new Response(JSON.stringify({ error: 'Entry ID is required' }), {
      status: 400,
    });
  }

  try {
    await deleteEntryById(entryId, user.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to delete entry' }),
      { status: error.statusCode || 500 },
    );
  }
}

export const DELETE = withAuth(deleteEntryRoute);
