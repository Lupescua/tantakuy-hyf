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
 * Dummy hash for timing attack prevention
 * Pre-generated with 12 rounds to match real password hashing
 * This ensures consistent timing whether user exists or not
 */
export const DUMMY_HASH =
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIRQ9TJZ1u';
