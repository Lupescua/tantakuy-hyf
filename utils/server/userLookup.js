import Participant from '@/app/api/models/Participant';
import Company from '@/app/api/models/Company';

/**
 * Find a user (Participant or Company) by reset token
 *
 * This is safe to use even when the same email exists in both collections
 * because the reset token acts as a unique discriminator between accounts.
 *
 * @param {string} email - The email to search for
 * @param {string} token - The reset token
 * @returns {Promise<{user: Object|null, role: 'participant'|'company'|null}>}
 */
export async function findUserByResetToken(email, token) {
  const query = {
    email,
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  };

  let user = await Participant.findOne(query);
  if (user) {
    return { user, role: 'participant' };
  }

  user = await Company.findOne(query);
  if (user) {
    return { user, role: 'company' };
  }

  return { user: null, role: null };
}
