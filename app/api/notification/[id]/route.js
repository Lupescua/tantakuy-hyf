import dbConnect from '@/utils/dbConnects';
import Notification from '../../models/Notifications';
import { NextResponse } from 'next/server';

export async function DELETE(request, context) {
  await dbConnect();

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
