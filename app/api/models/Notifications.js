import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Participant',
      required: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'actorType',
      required: true,
    },
    actorType: {
      type: String,
      required: true,
      enum: ['Participant', 'Company'],
    },
    entry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Entry',
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'share', 'win'],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model('Notification', NotificationSchema);

export default Notification;
