import mongoose from 'mongoose';

const EntrySchema = new mongoose.Schema(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    caption: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

//reuse the existing model if it’s already registered:
const Entry = mongoose.models.Entry || mongoose.model('Entry', EntrySchema);
export default Entry;
