import { withDB } from '@/utils/withDB';
import Notification from '../../models/Notifications';
import { serverError, success } from '@/utils/apiResponse';

async function deleteNotification(request, context) {
  const { id } = await context.params;

  try {
    await Notification.findByIdAndDelete(id);
    return success({});
  } catch (err) {
    return serverError(err.message, err);
  }
}

export const DELETE = withDB(deleteNotification);
