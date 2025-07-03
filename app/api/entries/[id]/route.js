import dbConnect from '@/utils/dbConnects';
import Entry from '@/app/api/models/Entry';
import '@/app/api/models/Participant'; // make sure the schema is registered
import { withAuth } from '@/utils/authMiddleware';
import { isValidObjectId } from 'mongoose';

/* ───────── GET /api/entries/[id] ───────── */
export async function GET(_request, context) {
  /* 1. grab the dynamic id ***before*** the first await  */
  const id = context.params?.id;
  if (!isValidObjectId(id)) {
    return Response.json({ error: 'Bad id' }, { status: 400 });
  }

  /* 2. connect to DB (now it’s safe to await) */
  await dbConnect();

  try {
    /* 3. fetch entry + participant username */
    const entry = await Entry.findById(id)
      .populate({
        path: 'participant',
        select: 'userName',
        model: 'Participant',
      })
      .lean();

    if (!entry) {
      return Response.json({ error: 'Entry not found' }, { status: 404 });
    }
    return Response.json(entry, { status: 200 });
  } catch (err) {
    console.error('Error fetching entry:', err);
    return Response.json({ error: 'Failed to fetch entry' }, { status: 500 });
  }
}

/* ───────── DELETE /api/entries/[id] (auth) ───────── */
async function deleteEntry(req, { params, user }) {
  const entryId = params.id;
  if (!isValidObjectId(entryId)) {
    return Response.json({ error: 'Bad id' }, { status: 400 });
  }

  await dbConnect();

  try {
    const entry = await Entry.findById(entryId);
    if (!entry)
      return Response.json({ error: 'Entry not found' }, { status: 404 });
    if (entry.participant.toString() !== user.id)
      return Response.json({ error: 'Forbidden' }, { status: 403 });

    await Entry.deleteOne({ _id: entryId });
    return Response.json(null, { status: 204 });
  } catch (err) {
    console.error('Error deleting entry:', err);
    return Response.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}

export const DELETE = withAuth(deleteEntry);
