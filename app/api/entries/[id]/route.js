import { withDB } from '@/utils/withDB';
import { withAuth } from '@/utils/authMiddleware';
import { getUserFromCookie } from '@/utils/server/auth';
import Entry from '@/app/api/models/Entry';
import '@/app/api/models/Participant';
import { isValidObjectId } from 'mongoose';
import s3 from '@/utils/s3Client';
import { NextResponse } from 'next/server';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createNotification } from '@/app/services/notificationServices';

/* helper – pull :id safely from the URL string */
function extractId(request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').pop(); // last segment
  return isValidObjectId(id) ? id : null;
}

/* ───────────── GET /api/entries/[id] ───────────── */
async function getEntry(request) {
  const id = extractId(request);
  if (!id) return Response.json({ error: 'Bad id' }, { status: 400 });

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
async function deleteEntry(request, context) {
  const id = extractId(request);
  if (!id) {
    return NextResponse.json({ error: 'Bad id' }, { status: 400 });
  }

  // ↳ Get user from withAuth
  const userId = context.user.id;

  const entry = await Entry.findById(id).lean();
  if (!entry)
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  if (entry.participant.toString() !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // Only delete from S3 if the URL is for your bucket
    const bucketDomain = `${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
    if (entry.imageUrl.includes(bucketDomain)) {
      const key = entry.imageUrl.split(`/${bucketDomain}/`)[1];
      if (key) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
          }),
        );
      }
    }

    // delete the Mongo record
    await Entry.deleteOne({ _id: id });

    // Return a clean 204 No Content
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Error deleting entry:', err);
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 },
    );
  }
}

/* ─────────── PATCH /api/entries/[id] ──────────── */
async function patchEntry(request) {
  const id = extractId(request);
  if (!id) {
    return Response.json({ error: 'Bad id' }, { status: 400 });
  }

  // Try to pull actor info if logged in
  const user = await getUserFromCookie();
  let actorId, actorType;
  if (user) {
    actorId = user.id;
    actorType = user.role === 'company' ? 'Company' : 'Participant';
  }

  try {
    // increment the shares counter
    const updated = await Entry.findByIdAndUpdate(
      id,
      { $inc: { shares: 1 } },
      { new: true },
    );

    if (!updated) {
      return Response.json({ error: 'Entry not found' }, { status: 404 });
    }

    // If we have a valid actorId, fire a “share” notification:
    if (actorId) {
      await createNotification(updated._id, actorId, 'share', actorType);
    }

    // return the new share count (optional)
    return Response.json(
      { success: true, shares: updated.shares },
      { status: 200 },
    );
  } catch (err) {
    console.error('Error incrementing shares:', err);
    return Response.json(
      { error: 'Failed to increment shares' },
      { status: 500 },
    );
  }
}

export const GET = withDB(getEntry);
export const DELETE = withAuth(deleteEntry);
export const PATCH = withDB(patchEntry);
