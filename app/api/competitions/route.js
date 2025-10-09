import Competition from '../models/Competition';
import Company from '../models/Company';
import Entry from '../models/Entry';
import { getUserFromCookie } from '@/utils/server/auth';
import { withDB } from '@/utils/withDB';
import mongoose from 'mongoose';
import {
  success,
  created,
  unauthorized,
  badRequest,
  serverError,
  serviceUnavailable,
} from '@/utils/apiResponse';

async function getCompetitions(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase();
  const companyId = searchParams.get('companyId');
  const sort = searchParams.get('sort') || 'popularity';
  const limit = Math.min(parseInt(searchParams.get('limit')) || 100, 100); // Max 100

  try {
    // Build database query object to leverage indexes
    const query = {};
    if (companyId) {
      query.company = companyId;
    }
    if (search) {
      // Use text search to leverage the text index on title
      query.$text = { $search: search };
    }

    // Fetch competitions from database with filters applied
    // Note: No initial sort here - sorting is handled below based on sort parameter
    // Apply limit to prevent loading excessive data
    let competitions = await Competition.find(query)
      .populate('company', 'companyName')
      .limit(limit)
      .lean();

    // If searching, filter by company name in-memory (title already filtered in DB)
    if (search) {
      competitions = competitions.filter((c) => {
        const companyMatch = c.company?.companyName
          ?.toLowerCase()
          .includes(search);
        return companyMatch;
      });
    }

    // Apply sorting based on sort parameter
    if (sort === 'popularity') {
      const compIds = competitions.map((c) => c._id);
      const counts = await Entry.aggregate([
        { $match: { competition: { $in: compIds } } },
        { $group: { _id: '$competition', count: { $sum: 1 } } },
      ]);

      const countMap = {};
      counts.forEach((item) => {
        countMap[item._id.toString()] = item.count;
      });

      competitions.forEach((c) => {
        c.entryCount = countMap[c._id.toString()] || 0;
      });

      competitions.sort((a, b) => b.entryCount - a.entryCount);
    } else if (sort === 'date') {
      competitions.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    return success({ competitions });
  } catch (error) {
    console.error('Error fetching competitions:', error);
    return serverError('Failed to fetch competitions', error);
  }
}

export const GET = withDB(getCompetitions);

async function createCompetition(req) {
  try {
    // 1) auth
    const user = await getUserFromCookie();
    if (!user) {
      return unauthorized();
    }

    // 2) parse + validate payload
    const competitionData = await req.json();
    competitionData.company = user.id;

    // 3) create
    const competition = await Competition.create(competitionData);

    return created({ competition });
  } catch (err) {
    // Log full error details for debugging
    console.error('Error creating competition:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      errors: err.errors, // Mongoose validation errors
    });

    // Mongoose validation error (400)
    if (
      err.name === 'ValidationError' ||
      err instanceof mongoose.Error.ValidationError
    ) {
      // Extract validation error messages
      const validationErrors = Object.keys(err.errors || {}).map(
        (field) => `${field}: ${err.errors[field].message}`,
      );
      const message =
        validationErrors.length > 0
          ? validationErrors.join(', ')
          : err.message || 'Validation failed';
      return badRequest(message);
    }

    // Database/network errors (503)
    if (
      err.name === 'MongoNetworkError' ||
      err.name === 'MongoServerError' ||
      err.message?.toLowerCase().includes('network') ||
      err.message?.toLowerCase().includes('timeout') ||
      err.message?.toLowerCase().includes('econnrefused') ||
      err.message?.toLowerCase().includes('connection')
    ) {
      return serviceUnavailable('Database temporarily unavailable');
    }

    // All other errors (500)
    return serverError('Failed to create competition');
  }
}

export const POST = withDB(createCompetition);
