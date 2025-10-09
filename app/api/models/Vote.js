import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema(
  {
    entry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Entry',
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Participant',
      required: true,
    },
    voteType: {
      type: String,
      enum: ['like'],
      required: true,
    },
  },
  { timestamps: true },
);

// Enforce one vote per user per entry (compound unique index)
VoteSchema.index({ participant: 1, entry: 1 }, { unique: true });

// Index for counting votes by entry (used in aggregations)
// Used in: POST /api/competitions/[id]/draw, getUserCompetitionStats
VoteSchema.index({ entry: 1 });
//saguard against double-registration
const Vote = mongoose.models.Vote || mongoose.model('Vote', VoteSchema);
export default Vote;
