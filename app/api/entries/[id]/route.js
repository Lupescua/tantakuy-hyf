import dbConnect from '@/utils/dbConnects';
import Entry from '../models/Entry';
import { withAuth } from '@/utils/authMiddleware';

async function deleteEntry(req, { params, user }) {
  await dbConnect();

  const entryId = params.id;
  if (!entryId) {
    return new Response(JSON.stringify({ error: 'Entry ID is required' }), {
      status: 400,
    });
  }

  try {
    const entry = await Entry.findById(entryId);

    if (!entry) {
      return new Response(JSON.stringify({ error: 'Entry not found' }), {
        status: 404,
      });
    }

    if (entry.participant.toString() !== user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
      });
    }

    await Entry.findByIdAndDelete(entryId);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete entry' }), {
      status: 500,
    });
  }
}

export const DELETE = withAuth(deleteEntry);
