import Entry from '../models/Entry';
import mongoose from 'mongoose';
import { withAuth } from '@/utils/authMiddleware';
import { withDB } from '@/utils/withDB';
import { badRequest, serverError, success, created } from '@/utils/apiResponse';

async function getEntries(req) {
  const { searchParams } = new URL(req.url);
  const competitionId = searchParams.get('competitionId');

  if (!competitionId) {
    return badRequest('competitionId query parameter is required');
  }

  if (!mongoose.Types.ObjectId.isValid(competitionId)) {
    return badRequest('Invalid competitionId');
  }

  try {
    const entries = await Entry.find({ competition: competitionId }).sort({
      createdAt: -1,
    });

    return success(entries);
  } catch (error) {
    return serverError('Failed to fetch entries', error);
  }
}

export const GET = withDB(getEntries);

async function createEntry(req, { params, user }) {
  try {
    const body = await req.json();
    const { competition, imageUrl, caption } = body;

    if (!competition || !imageUrl) {
      return badRequest('Competition and imageUrl are required');
    }

    const newEntry = await Entry.create({
      competition,
      participant: user.id,
      imageUrl,
      caption,
    });

    return created(newEntry);
  } catch (error) {
    return serverError('Failed to create entry', error);
  }
}

export const POST = withAuth(createEntry);
