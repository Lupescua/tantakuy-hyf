import dbConnect from '@/utils/dbConnects';
import Notification from '../models/Notifications';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await dbConnect();
  console.log("this is user id", req.nextUrl.searchParams.get('userId'))
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const notifications = await Notification.find({ recipient: userId })
    .populate('actor', 'userName')
    .populate('entry', 'caption')
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ success: true, notifications });
}