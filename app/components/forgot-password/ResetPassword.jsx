'use client';
import React, { useState } from 'react';
import styles from '../../../style/ForgotPassword.module.css';
import { useRouter } from 'next/navigation';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Here we should typically send the email and password to the backend for processing
    console.log('Resetting password for:', email);
    console.log('New password:', newPassword);

    // Redirect to login page after successful reset
    alert(
      'Password reset successful! You can now log in with your new password.',
    );
    router.push('/login');
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Email verified please login</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>New Password</label>
          <input
            type="password"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Confirm Password</label>
          <input
            type="password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              style={{ marginRight: '8px' }}
            />
            Remember me
          </label>
        </div>

        <button type="submit" className={styles.submitButton}>
          Log in →
        </button>
      </form>
    </div>
  );
}
