import dbConnect from '@/utils/dbConnects';
import Entry from '@/app/api/models/Entry';
import '@/app/api/models/Participant';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';
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
  if (!id) {
    return NextResponse.json({ error: 'Bad id' }, { status: 400 });
  }

  // ↳ Auth flow
  const store = await cookies();
  const token = store.get('token')?.value;
  if (!token)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let userId;
  try {
    userId = verifyToken(token).id;
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

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
export async function PATCH(request) {
  const id = extractId(request);
  if (!id) {
    return Response.json({ error: 'Bad id' }, { status: 400 });
  }

  await dbConnect();

  // Try to pull actor info if logged in, but don’t crash if not
  let actorId, actorType;
  try {
    const store = await cookies();
    const token = store.get('token')?.value;
    if (token) {
      const payload = verifyToken(token);
      actorId = payload.id;
      actorType = payload.role === 'company' ? 'Company' : 'Participant';
    }
  } catch {
    // not logged in or invalid token –> no notification
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
