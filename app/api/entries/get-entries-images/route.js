
import dbConnect from '../../../../utils/dbConnects';
import Entry from '../../models/Entry';
import { withAuth } from '../../../../utils/authMiddleware';
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
  
    if (!userId) {
        return Response.json(
            { success: false, message: 'userId is required' },
            { status: 400 }
          );
    }
  
    await dbConnect();
  
    const entries = await Entry.find({ participant: userId }).populate('participant');
  
    const formattedEntries = entries.map(entry => ({
      id: entry._id,
      title: entry.caption || 'Untitled Entry',
      username: entry.participant?.name || 'Unknown',
      imageUrl: entry.imageUrl || 'https://via.placeholder.com/600x400',
      description: entry.description || '',
      votes: entry.votes || 0,
    }));
  
    return Response.json(
        { success: true, message: 'Entries fetched successfully', data: formattedEntries },
        { status: 200 }
      );
  
  }