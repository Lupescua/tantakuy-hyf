import Participant from '../api/models/Participant';
import Company from '../api/models/Company';
import { signJwt } from '@/utils/jwt';
import { AppError } from '@/utils/errorHandler';
import { generateDummyHash } from '@/utils/bcrypt';

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

  // 3) Always check password - prevents timing attack
  if (!user) {
    // Simulate password hashing even if user doesn't exist (consistent timing)
    // Hash is never stored or reused - just burns CPU time to prevent timing attacks
    await generateDummyHash(password);
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  // 3️⃣ Sign JWT with role
  const token = signJwt({
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
