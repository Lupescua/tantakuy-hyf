import dbConnect from '../../../../utils/dbConnects';
import Entry from '../../models/Entry';

export async function POST(req) {
    await dbConnect();
    
    const { imageUrl, caption, participant, competition, description} = await req.json();

    console.log(imageUrl, caption, participant, competition, description)
    console.log("hitshitshistjsojflsafj")
    if (!participant || !imageUrl) {
      return new Response(JSON.stringify({ error: 'userId and imageUrl are required' }), { status: 400 });
    }
  
    try {
      const newEntry = await Entry.create({
        participant: participant,
        imageUrl,
        caption,
        description,
        votes: 0,
        competition: competition
      });
  
      return new Response(JSON.stringify({ success: true, entry: newEntry }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error creating entry:', error);
      return new Response(JSON.stringify({ error: 'Failed to create entry' }), { status: 500 });
    }
  }