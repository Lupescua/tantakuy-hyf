import { NextResponse } from 'next/server';
import { getUserCompetitionStats } from '@/app/services/entryServices';
import dbConnect from '@/utils/dbConnects';

export async function GET(request, context) {
    // await dbConnect();
    
  
    const params = await context.params;  
    const userId = params.id;
    

  
    console.log(userId);
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const stats = await getUserCompetitionStats(userId);

    if (!stats || stats.length === 0) {
        console.log('No competition stats found for userId:', userId);
        return NextResponse.json({ error: 'No data found' }, { status: 200 });
      }

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}