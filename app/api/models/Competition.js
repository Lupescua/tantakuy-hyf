import mongoose from 'mongoose';

const CompetitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    competitionTerms: {
      type: String,
    },
    dateOfEnd: {
      type: Date,
      required: [true, 'End date is required'],
    },
    winnerSelectionDate: {
      type: Date,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  { timestamps: true },
);

const Competition = mongoose.model('Competition', CompetitionSchema);
export default Competition;
