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

VoteSchema.index({ participant: 1, entry: 1 }, { unique: true });
const Vote = mongoose.model('Vote', VoteSchema);
export default Vote;
