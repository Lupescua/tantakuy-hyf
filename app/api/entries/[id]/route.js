import dbConnect from '@/utils/dbConnects';
import Entry from '@/app/api/models/Entry';
import { withAuth } from '@/utils/authMiddleware';

/* ---------------- GET /api/entries/[id] ----------------
   Public – no auth needed – returns one entry document   */
export async function GET(request, context) {
  await dbConnect();

  const { id } = context.params;
  if (!id) {
    return Response.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    const entry = await Entry.findById(id).populate(
      'participant',
      'userName email',
    );
    if (!entry) {
      return Response.json({ error: 'Entry not found' }, { status: 404 });
    }
    return Response.json(entry, { status: 200 });
  } catch (err) {
    console.error('Error fetching entry:', err);
    return Response.json({ error: 'Failed to fetch entry' }, { status: 500 });
  }
}

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

    const deletedEntry = await Entry.findByIdAndDelete(entryId);

    if (!deletedEntry) {
      return new Response(JSON.stringify({ error: 'Failed to delete entry' }), {
        status: 500,
      });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete entry' }), {
      status: 500,
    });
  }
}

export const DELETE = withAuth(deleteEntry);
