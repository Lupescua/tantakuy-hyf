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

// Index for fetching entries by competition
// Used in: GET /api/entries/by-competition/[id], POST /api/competitions/[id]/draw
EntrySchema.index({ competition: 1 });

// Index for fetching entries by participant
// Used in: GET /api/entries/get-entries-images, getUserCompetitionStats
EntrySchema.index({ participant: 1 });

//reuse the existing model if it’s already registered:
const Entry = mongoose.models.Entry || mongoose.model('Entry', EntrySchema);
export default Entry;
