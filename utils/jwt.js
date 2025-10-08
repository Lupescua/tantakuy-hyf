import jwt from 'jsonwebtoken';

const ALG = 'HS256';
const DEFAULT_EXPIRES = '2h';
const JWT_SECRET = process.env.JWT_SECRET;

export function signJwt(payload, { expiresIn = DEFAULT_EXPIRES } = {}) {
  return jwt.sign(payload, JWT_SECRET, { algorithm: ALG, expiresIn });
}

export function verifyToken(token) {
  try {
    return {
      ok: true,
      payload: jwt.verify(token, JWT_SECRET, { algorithms: [ALG] }),
    };
  } catch (err) {
    const code = err.name === 'TokenExpiredError' ? 'expired' : 'invalid';
    return { ok: false, code };
  }
}
