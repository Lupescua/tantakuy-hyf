import Participant from '../api/models/Participant';
import { AppError } from '@/utils/errorHandler';
import { generateToken } from '@/utils/jwt';

export async function createParticipant(user = {}) {
  const { userName, email, password } = user;
  if (!email || !userName || !password) {
    throw new AppError('userName, email, and password are required!', 400);
  }
  const [existingEmail, existingUserName] = await Promise.all([
    Participant.findOne({ email }),
    Participant.findOne({ userName }),
  ]);

  if (existingEmail) {
    throw new AppError('Email already in use', 409);
  }

  if (existingUserName) {
    throw new AppError('Username already taken', 409);
  }

  const newParticipant = new Participant({ userName, email, password });
  await newParticipant.save();

  const token = generateToken({
    id: newParticipant._id,
    email: newParticipant.email,
    userName: newParticipant.userName,
  });

  return { user: newParticipant, token };
}
