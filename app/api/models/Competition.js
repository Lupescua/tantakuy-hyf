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
    prize: {
      type: String,
      required: [true, 'prize is required'],
    },
     startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      validate: {
        validator: function (value) {
          return value < this.endDate;
        },
        message: 'Start date must be before end date',
      },
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
    participationDeadline: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return this.endDate && value <= this.endDate;
        },
        message: 'participation deadline must be before or equal to end date',
      },
    },
        votingDeadline: {
          type: Date,
          validate: {
            validator: function (value) {
              if (!value || !this.participationDeadline) return true;
              return value >= this.participationDeadline;
            },
            message: 'Voting deadline must be after participation deadlin',
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
    winnerAnnouncingDate: {
    type: Date,
    validate: {
      validator: function (value) {
        if (!value || !this.winnerSelectionDate) return true;
        return value >= this.winnerSelectionDate;
      },
      message: 'Winner announcing date must be after winner selection date',
    },
  },

  image: {
  type: String,
  required: false,
},

    website: String,
    facebook: String,
    instagram: String,
    linkedin: String,

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
