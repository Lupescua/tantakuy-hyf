import { withDB } from '@/utils/withDB';
import Entry from '@/app/api/models/Entry';
import { getUserFromCookie } from '@/utils/server/auth';
import { isValidObjectId } from 'mongoose';
import { unauthorized, badRequest, success } from '@/utils/apiResponse';

/* ───────── GET /api/entries/get-entries-images ───────── */
async function getEntriesImages(request) {
  /* 1. who is asking?  ─────────────────────────────────── */
  const { searchParams } = request.nextUrl;
  let userId = searchParams.get('userId'); // optional

  /* If no userId param, fall back to the logged-in user   */
  if (!userId) {
    const user = await getUserFromCookie();
    if (!user) {
      return unauthorized();
    }
    userId = user.id;
  }

  if (!isValidObjectId(userId)) {
    return badRequest('Bad user id');
  }

  /* 2. DB – fetch entries for that user  ───────────────── */
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

  return success({ data });
}

export const GET = withDB(getEntriesImages);
