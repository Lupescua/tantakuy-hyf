import Participant from '../api/models/Participant';
import { generateToken } from '@/utils/jwt';
import { AppError } from '@/utils/errorHandler';

export async function loginUser(login = {}) {
  const { email, password } = login;

  if (!email || !password) {
    throw new AppError('Email and password are required.', 400);
  }

  try {
    const participant = await Participant.findOne({ email });
    console.log(participant);
    if (!participant) {
      throw new AppError('Email or password is incorrect.', 401);
    }

    const isMatch = await participant.comparePassword(password);

    console.log(isMatch);

    if (!isMatch) {
      throw new AppError('password is incorrect.', 401);
    }

    const token = generateToken({
      id: participant._id,
      email: participant.email,
      userName: participant.userName,
    });

    return { token, user: participant };
  } catch (error) {
    throw new AppError(error.message || 'Login failed', 500);
  }
}
