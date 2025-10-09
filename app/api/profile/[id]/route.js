import Entry from '@/app/api/models/Entry';
import Company from '@/app/api/models/Company';
import Competition from '../../models/Competition';
import { isValidObjectId } from 'mongoose';
import Vote from '../../models/Vote';
import { withDB } from '@/utils/withDB';
import { badRequest, serverError, success } from '@/utils/apiResponse';

async function getUserProfile(request, context) {
  const params = await context.params;
  const userId = params.id;

  if (!isValidObjectId(userId)) {
    return badRequest('Invalid user ID');
  }

  try {
    // 1) Find all entries this user submitted
    const entries = await Entry.find({ participant: userId })
      .populate({
        path: 'competition',
        select: 'title company', // only these two fields from Competition
        populate: {
          path: 'company',
          select: 'companyName', // grab only the company's name
        },
      })
      .lean();

    // 2) Map into the shape your frontend expects:

    // drop any with missing competition
    const good = entries.filter((e) => e.competition);

    // 3) Count votes for all entries in a single aggregation query
    const entryIds = good.map((e) => e._id);
    const voteCounts = await Vote.aggregate([
      { $match: { entry: { $in: entryIds } } },
      { $group: { _id: '$entry', count: { $sum: 1 } } },
    ]);

    // Create a map for O(1) lookup
    const voteMap = {};
    voteCounts.forEach((v) => {
      voteMap[v._id.toString()] = v.count;
    });

    // 4) Map entries to the shape your frontend expects
    const data = good.map((e) => ({
      id: e._id.toString(),
      title: e.competition.title,
      company: e.competition.company?.companyName || 'Ukendt',
      likes: voteMap[e._id.toString()] || 0, // 0 if no votes
      shares: e.shares || 0, // 0 if undefined
      saved: 0,
      imageUrl: e.imageUrl,
    }));

    return success({ data });
  } catch (err) {
    return serverError('Internal server error', err);
  }
}

export const GET = withDB(getUserProfile);
