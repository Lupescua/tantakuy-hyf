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
      required: [true, 'Competition terms is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: 'End date must be in the future',
      },
    },
    winnerSelectionDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return this.endDate && value > this.endDate;
        },
        message: 'Winner selection date must be after end date',
      },
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  { timestamps: true },
);

const Competition =
  mongoose.models.Competition ||
  mongoose.model('Competition', CompetitionSchema);
export default Competition;
