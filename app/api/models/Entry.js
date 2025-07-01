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
      ref: 'Participant',
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
  },
  { timestamps: true },
);

//reuse the existing model if it’s already registered:
const Entry = mongoose.models.Entry || mongoose.model('Entry', EntrySchema);
export default Entry;
