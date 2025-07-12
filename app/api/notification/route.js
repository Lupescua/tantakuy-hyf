import dbConnect from '@/utils/dbConnects';
import Notification from '../models/Notifications';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await dbConnect();
  console.log('this is user id', req.nextUrl.searchParams.get('userId'));
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const notifications = await Notification.find({ recipient: userId })
    .populate('actor', 'userName')
    .populate('entry', 'caption')
    .sort({ createdAt: -1 })
    .lean();

  // Normalize the data to return `id` instead of `_id`, and handle missing references
  const cleaned = notifications.map((n) => ({
    id: n._id.toString(), // Normalize main notification ID
    actor: {
      id: n.actor?._id?.toString() || '', // Fallback to empty string if actor missing
      userName: n.actor?.userName || 'Unknown', // Default to 'Unknown' if userName missing
    },
    entry: {
      id: n.entry?._id?.toString() || '', // Fallback for missing entry
      caption: n.entry?.caption || '', // Default caption if missing
    },
    type: n.type, // Either 'like' or 'share' (or other types if added later)
  }));

  // Return the normalized notification list
  return NextResponse.json({ success: true, notifications: cleaned });
}

export async function DELETE(req) {
  await dbConnect();
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    await Notification.deleteMany({ recipient: userId });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
