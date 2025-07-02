import Entry from '../models/Entry';
import { AppError } from '@/utils/errorHandler';
import { dbConnect } from '@/utils/dbConnects';

export async function getEntriesByCompetition(competitionId) {
  await dbConnect();
  return await Entry.find({ competition: competitionId }).sort({
    createdAt: -1,
  });
}
export async function createEntry({
  competition,
  participantId,
  imageUrl,
  caption,
}) {
  await dbConnect();
  [
    [competition, 'Competition is required.', 400],
    [participantId, 'Participant ID is required.', 401],
    [imageUrl, 'Image URL is required.', 400],
  ].forEach(([value, message, code]) => {
    if (!value) throw new AppError(message, code);
  });

  try {
    const newEntry = await Entry.create({
      competition,
      participant: participantId,
      imageUrl,
      caption,
    });
    return newEntry;
  } catch (error) {
    console.error('Error creating entry:', error);
    throw new AppError('Failed to create entry.', 500);
  }
}

export async function deleteEntryById(entryId, userId) {
  await dbConnect();

  const entry = await Entry.findById(entryId);
  if (!entry) {
    throw new AppError('Entry not found', 404);
  }

  if (entry.participant.toString() !== userId) {
    throw new AppError('Forbidden', 403);
  }

  const deletedEntry = await Entry.findByIdAndDelete(entryId);
  if (!deletedEntry) {
    throw new AppError('Failed to delete entry', 500);
  }
}
