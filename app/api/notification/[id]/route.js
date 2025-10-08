import { withDB } from '@/utils/withDB';
import Notification from '../../models/Notifications';
import { NextResponse } from 'next/server';

async function deleteNotification(request, context) {
  const { id } = await context.params;

  try {
    await Notification.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}

export const DELETE = withDB(deleteNotification);
