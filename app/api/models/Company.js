import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const CompanySchema = new mongoose.Schema(
  {
    logoUrl: String,
    coverPictureUrl: String,
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    contactPersonName: {
      type: String,
      required: [true, 'Contact person name is required'],
    },
    position: String,
    businessNumber: Number,
    cvrNumber: { type: Number, required: [true, 'CVR number is required'] },

    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      validate: {
        validator: function (value) {
          return /[A-Z]/.test(value);
        },
        message: 'Password must contain at least one uppercase letter',
      },
    },
    location: String,
    shortDescription: {
      type: String,
      maxlength: 160,
    },
    description: String,
    website: String,
    facebook: String,
    instagram: String,
    competitions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Competition',
      },
    ],
    followersCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

CompanySchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

CompanySchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Company = mongoose.model('Company', CompanySchema);
export default Company;
