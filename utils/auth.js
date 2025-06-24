import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) {
    throw new Error('No token provided');
  }
  return jwt.verify(token, process.env.JWT_SECRET);
}
