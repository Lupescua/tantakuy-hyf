// app/api/entries/create-new-entry/route.js
import { withDB } from '@/utils/withDB';
import Entry from '@/app/api/models/Entry';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';
import { isValidObjectId } from 'mongoose';

async function createNewEntry(req) {
  // ── 1) Authenticate via cookie
  const store = await cookies();
  const token = store.get('token')?.value;
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = verifyToken(token);
  if (!result.ok) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const participantId = result.payload.id;

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

export const POST = withDB(createNewEntry);
