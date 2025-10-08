import bcrypt from 'bcryptjs';

/**
 * Centralized bcrypt configuration
 * Using 12 rounds for security (OWASP recommendation as of 2024)
 */
export const BCRYPT_ROUNDS = 12;

/**
 * Hash a password using the configured rounds
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 * @throws {Error} If password is invalid or exceeds max length
 */
export async function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  // bcrypt silently truncates passwords > 72 bytes UTF-8
  // Check byte length to prevent unexpected behavior
  const byteLength = Buffer.byteLength(password, 'utf8');
  if (byteLength > 72) {
    throw new Error(
      'Password exceeds maximum length (72 bytes UTF-8). Current length: ' +
        byteLength +
        ' bytes',
    );
  }

  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare a plain text password with a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if match
 * @throws {Error} If inputs are invalid
 */
export async function comparePassword(password, hash) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  if (!hash || typeof hash !== 'string') {
    throw new Error('Hash must be a non-empty string');
  }

  return bcrypt.compare(password, hash);
}

/**
 * Pre-computed dummy hash for timing attack prevention
 * This is a valid bcrypt hash that will never match any real password
 * Generated once and stored as a constant - safe to be public
 */
const DUMMY_HASH =
  '$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW';

/**
 * Compare against dummy hash for timing attack prevention
 * Uses bcrypt.compare to ensure identical timing to real auth path
 * This ensures consistent timing whether user exists or not
 * @param {string} input - The input to compare (typically the password attempt)
 * @returns {Promise<boolean>} Always returns false
 */
export async function compareWithDummyHash(input) {
  // Use bcrypt.compare to ensure identical timing to real auth path
  // Real path: bcrypt.compare(password, storedHash)
  // Dummy path: bcrypt.compare(password, DUMMY_HASH)
  return bcrypt.compare(input, DUMMY_HASH);
}
