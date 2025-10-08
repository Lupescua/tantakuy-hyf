// app/api/entries/create-new-entry/route.js
import { withAuth } from '@/utils/authMiddleware';
import Entry from '@/app/api/models/Entry';
import { isValidObjectId } from 'mongoose';

async function createNewEntry(req, context) {
  // ── 1) Get user from withAuth
  const participantId = context.user.id;

  // ── 2) Parse + validate body
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { imageUrl, caption = '', description = '', competition } = body;
  if (!imageUrl || !competition || !isValidObjectId(competition)) {
    return new Response(JSON.stringify({ error: 'Bad payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
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
  return new Response(JSON.stringify({ success: true, entryId: entry._id }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST = withAuth(createNewEntry);
