import { dbConnect } from '@/utils/dbConnects';
import Entry from '../models/Entry';
import { withAuth } from '@/utils/authMiddleware';
import { deleteEntryById } from '@/app/services/entryServices';

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
