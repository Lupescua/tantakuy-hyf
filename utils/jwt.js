import jwt from 'jsonwebtoken';
import { env } from './env';

const ALG = 'HS256';
const DEFAULT_EXPIRES = '2h';

export function signJwt(payload, { expiresIn = DEFAULT_EXPIRES } = {}) {
  return jwt.sign(payload, env.JWT_SECRET, { algorithm: ALG, expiresIn });
}

export function verifyJwt(token) {
  try {
    return { ok: true, payload: jwt.verify(token, env.JWT_SECRET, { algorithms: [ALG] }) };
  } catch (err) {
    const code = err.name === 'TokenExpiredError' ? 'expired' : 'invalid';
    return { ok: false, code };
  }
}
