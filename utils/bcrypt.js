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
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare a plain text password with a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if match
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a dummy hash on-demand for timing attack prevention
 * Uses a random salt each time to ensure the hash is never reusable
 * This ensures consistent timing whether user exists or not
 * @param {string} input - The input to hash (typically the password attempt)
 * @returns {Promise<string>} A bcrypt hash that will never match
 */
export async function generateDummyHash(input) {
  // Hash with random salt - result is unpredictable and useless for attacks
  return bcrypt.hash(input + Math.random().toString(36), BCRYPT_ROUNDS);
}
