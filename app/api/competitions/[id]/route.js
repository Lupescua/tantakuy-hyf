// app/api/competitions/[id]/route.js
import Competition from '../../models/Competition';
import { isValidObjectId } from 'mongoose';
import { withDB } from '@/utils/withDB';
import {
  success,
  badRequest,
  notFound,
  serverError,
} from '@/utils/apiResponse';

async function getCompetition(request) {
  const pathname = new URL(request.url).pathname;
  const id = pathname.split('/').pop();

  if (!isValidObjectId(id)) {
    return badRequest('Invalid competition ID');
  }

  try {
    const competition = await Competition.findById(id);
    if (!competition) {
      return notFound('Competition not found');
    }

    return success({ competition });
  } catch (err) {
    console.error('Error fetching competition:', err);
    return serverError('Internal Server Error', err);
  }
}

export const GET = withDB(getCompetition);

async function deleteCompetition(request) {
  const pathname = new URL(request.url).pathname;
  const id = pathname.split('/').pop();

  if (!isValidObjectId(id)) {
    return badRequest('Invalid competition ID');
  }

  try {
    const deleted = await Competition.findByIdAndDelete(id);
    if (!deleted) {
      return notFound('Competition not found');
    }

    return success({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting competition:', err);
    return serverError('Internal Server Error', err);
  }
}

export const DELETE = withDB(deleteCompetition);

/* ─────────── PATCH /api/competitions/[id] ─────────── */
async function patchCompetition(request) {
  const pathname = new URL(request.url).pathname;
  const id = pathname.split('/').pop();
  if (!isValidObjectId(id)) {
    return badRequest('Invalid competition ID');
  }

  try {
    const updated = await Competition.findByIdAndUpdate(
      id,
      { $inc: { clicks: 1 } },
      { new: true },
    );
    if (!updated) {
      return notFound('Competition not found');
    }

    return success({ clicks: updated.clicks });
  } catch (err) {
    console.error('Error incrementing clicks:', err);
    return serverError('Failed to increment clicks', err);
  }
}

export const PATCH = withDB(patchCompetition);
