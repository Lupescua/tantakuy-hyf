import { withDB } from '@/utils/withDB';
import { withAuth } from '@/utils/authMiddleware';
import { getUserFromCookie } from '@/utils/server/auth';
import {
  success,
  badRequest,
  notFound,
  forbidden,
  serverError,
  noContent,
} from '@/utils/apiResponse';
import Entry from '@/app/api/models/Entry';
import '@/app/api/models/Participant';
import { isValidObjectId } from 'mongoose';
import s3 from '@/utils/s3Client';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createNotification } from '@/app/services/notificationServices';

/* ───────────── GET /api/entries/[id] ───────────── */
async function getEntry(request, context) {
  const { id } = await context.params;
  if (!isValidObjectId(id)) return badRequest('Invalid entry ID');

  try {
    const entry = await Entry.findById(id)
      .populate({
        path: 'participant',
        select: 'userName',
        model: 'Participant',
      })
      .lean();

    if (!entry) return notFound('Entry not found');

    return success({ entry });
  } catch (err) {
    console.error('Error fetching entry:', err);
    return serverError('Failed to fetch entry', err);
  }
}

/* ──────────── DELETE /api/entries/[id] (auth) ─────────── */
async function deleteEntry(request, context) {
  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return badRequest('Invalid entry ID');
  }

  // ↳ Get user from withAuth
  const userId = context.user.id;

  try {
    const entry = await Entry.findById(id).lean();
    if (!entry) return notFound('Entry not found');
    if (String(entry.participant) !== String(userId)) {
      return forbidden('You can only delete your own entries');
    }
    // Only delete from S3 if the URL is for your bucket
    try {
      const url = new URL(entry.imageUrl);
      const bucket = process.env.S3_BUCKET_NAME;
      const region = process.env.AWS_REGION;
      const allowedHosts = [
        `${bucket}.s3.${region}.amazonaws.com`,
        `${bucket}.s3.amazonaws.com`,
        `${bucket}.s3-${region}.amazonaws.com`,
      ].filter(Boolean);
      if (allowedHosts.includes(url.hostname)) {
        const key = url.pathname.substring(1); // Remove leading '/'
        if (key) {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: bucket,
              Key: key,
            }),
          );
        }
      }
    } catch (urlError) {
      console.warn('Failed to parse S3 URL, skipping S3 deletion:', urlError);
    }

    // delete the Mongo record
    await Entry.deleteOne({ _id: id });

    return noContent();
  } catch (err) {
    console.error('Error deleting entry:', err);
    return serverError('Failed to delete entry', err);
  }
}

/* ─────────── PATCH /api/entries/[id] ──────────── */
async function patchEntry(request, context) {
  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return badRequest('Invalid entry ID');
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
      return notFound('Entry not found');
    }

    // If we have a valid actorId, fire a "share" notification:
    if (actorId) {
      await createNotification(updated._id, actorId, 'share', actorType);
    }

    return success({ shares: updated.shares });
  } catch (err) {
    console.error('Error incrementing shares:', err);
    return serverError('Failed to increment shares', err);
  }
}

export const GET = withDB(getEntry);
export const DELETE = withAuth(deleteEntry);
export const PATCH = withDB(patchEntry);
