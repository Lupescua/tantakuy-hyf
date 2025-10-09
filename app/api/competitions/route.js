import Competition from '../models/Competition';
import Company from '../models/Company';
import Entry from '../models/Entry';
import { getUserFromCookie } from '@/utils/server/auth';
import { withDB } from '@/utils/withDB';
import {
  success,
  created,
  unauthorized,
  badRequest,
  serverError,
} from '@/utils/apiResponse';

async function getCompetitions(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase();
  const companyId = searchParams.get('companyId');
  const sort = searchParams.get('sort') || 'popularity';

  try {
    // Build database query object to leverage indexes
    const query = {};
    if (companyId) {
      query.company = companyId;
    }
    if (search) {
      // Use regex for case-insensitive title search
      query.title = { $regex: search, $options: 'i' };
    }

    // Fetch competitions from database with filters applied
    let competitions = await Competition.find(query)
      .populate('company', 'companyName')
      .sort({ createdAt: -1 })
      .lean();

    // If searching by company name (not covered by DB query), filter in-memory
    if (search) {
      competitions = competitions.filter((c) => {
        const titleMatch = c.title?.toLowerCase().includes(search);
        const companyMatch = c.company?.companyName
          ?.toLowerCase()
          .includes(search);
        return titleMatch || companyMatch;
      });
    }

    // Count votes or entries for popularity (simplified)
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
    const user = await getUserFromCookie(req);
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
    console.error('Error creating competition:', err);
    return badRequest(err.message || 'Failed to create competition');
  }
}

export const POST = withDB(createCompetition);
