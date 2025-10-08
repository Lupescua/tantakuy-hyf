import mongoose from 'mongoose';
import { hashPassword, comparePassword } from '@/utils/bcrypt';

const ParticipantSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      unique: true,
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
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Number,
    },
  },
  { timestamps: true },
);

ParticipantSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await hashPassword(this.password);
  next();
});

ParticipantSchema.methods.comparePassword = function (candidatePassword) {
  return comparePassword(candidatePassword, this.password);
};

const Participant =
  mongoose.models.Participant ||
  mongoose.model('Participant', ParticipantSchema);
export default Participant;
