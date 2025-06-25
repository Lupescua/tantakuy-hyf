import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ParticipantSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
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
    role: {
      type: String,
      default: 'participant',
      enum: ['participant'],
    },
  },
  { timestamps: true },
);

ParticipantSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

ParticipantSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Participant = mongoose.model('Participant', ParticipantSchema);

export default Participant;
