import dbConnect from '@/utils/dbConnects';
import Entry from '@/app/api/models/Entry';
import { cookies } from 'next/headers'; // ← ADD
import { verifyToken } from '@/utils/jwt'; // ← ADD
import { isValidObjectId } from 'mongoose';

/* ───────── GET /api/entries/get-entries-images ───────── */
export async function GET(request) {
  /* 1. who is asking?  ─────────────────────────────────── */
  const { searchParams } = new URL(request.url);
  let userId = searchParams.get('userId'); // optional

  /* If no userId param, fall back to the logged-in user   */
  if (!userId) {
    const store = await cookies();
    const token = store.get('token')?.value;
    if (!token)
      return Response.json({ error: 'Unauthorized' }, { status: 401 });

    try {
      userId = verifyToken(token).id;
    } catch {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (!isValidObjectId(userId)) {
    return Response.json({ error: 'Bad user id' }, { status: 400 });
  }

  /* 2. DB – fetch entries for that user  ───────────────── */
  await dbConnect();
  const entries = await Entry.find({ participant: userId })
    .select('imageUrl caption description votes') // leaner payload
    .lean();

  /* 3. shape response  ─────────────────────────────────── */
  const data = entries.map((e) => ({
    id: e._id,
    title: e.caption || 'Untitled Entry',
    imageUrl: e.imageUrl || 'https://via.placeholder.com/600x400',
    description: e.description || '',
    votes: e.votes || 0,
  }));

  return Response.json({ success: true, data }, { status: 200 });
}
