import dbConnect from '@/utils/dbConnects';
import Entry from '@/app/api/models/Entry';
import '@/app/api/models/Participant'; // registers schema
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';
import { isValidObjectId } from 'mongoose';

/* helper – pull :id safely from the URL string */
function extractId(request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').pop(); // last segment
  return isValidObjectId(id) ? id : null;
}

/* ───────────── GET /api/entries/[id] ───────────── */
export async function GET(request) {
  const id = extractId(request);
  if (!id) return Response.json({ error: 'Bad id' }, { status: 400 });

  await dbConnect();

  try {
    const entry = await Entry.findById(id)
      .populate({
        path: 'participant',
        select: 'userName',
        model: 'Participant',
      })
      .lean();

    if (!entry)
      return Response.json({ error: 'Entry not found' }, { status: 404 });

    return Response.json(entry, { status: 200 });
  } catch (err) {
    console.error('Error fetching entry:', err);
    return Response.json({ error: 'Failed to fetch entry' }, { status: 500 });
  }
}

/* ──────────── DELETE /api/entries/[id] (auth) ─────────── */
export async function DELETE(request) {
  const id = extractId(request);
  if (!id) return Response.json({ error: 'Bad id' }, { status: 400 });

  // auth
  const store = await cookies();
  const token = store.get('token')?.value;
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let userId;
  try {
    userId = verifyToken(token).id;
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const entry = await Entry.findById(id);
    if (!entry)
      return Response.json({ error: 'Entry not found' }, { status: 404 });

    if (entry.participant.toString() !== userId)
      return Response.json({ error: 'Forbidden' }, { status: 403 });

    await Entry.deleteOne({ _id: id });
    return Response.json(null, { status: 204 });
  } catch (err) {
    console.error('Error deleting entry:', err);
    return Response.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}
