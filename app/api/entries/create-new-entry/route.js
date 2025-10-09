// app/api/entries/create-new-entry/route.js
import { withAuth } from '@/utils/authMiddleware';
import Entry from '@/app/api/models/Entry';
import { isValidObjectId } from 'mongoose';
import { badRequest, created } from '@/utils/apiResponse';

async function createNewEntry(req, context) {
  // ── 1) Get user from withAuth
  const participantId = context.user.id;

  // ── 2) Parse + validate body
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return badRequest('Invalid JSON payload');
  }

  const { imageUrl, caption = '', description = '', competition } = body;
  if (!imageUrl || !competition || !isValidObjectId(competition)) {
    return badRequest('Bad payload');
  }

  // ── 3) Write to DB
  const entry = await Entry.create({
    competition,
    participant: participantId,
    imageUrl,
    caption,
    description,
  });

  // ── 4) Respond
  return created({ entryId: entry._id });
}

export const POST = withAuth(createNewEntry);
