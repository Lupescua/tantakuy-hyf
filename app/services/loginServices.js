import Participant from '../api/models/Participant';
import Company from '../api/models/Company';
import { generateToken } from '@/utils/jwt';
import { AppError } from '@/utils/errorHandler';

export async function loginUser(login = {}) {
  const { email, password } = login;

  if (!email || !password) {
    throw new AppError('Email and password are required.', 400);
  }

  // 1️) Try Participant
  let user = await Participant.findOne({ email });
  let role = 'participant';

  // 2) If none, try company
  if (!user) {
    user = await Company.findOne({ email });
    role = 'company';
  }

  if (!user) {
    throw new AppError('Email or password is incorrect.', 401);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError('password is incorrect.', 401);
  }

  // 3️⃣ Sign JWT with role
  const token = generateToken({
    id: user._id,
    role,
  });
  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      userName: user.userName ?? user.companyName,
      role,
    },
  };
}
