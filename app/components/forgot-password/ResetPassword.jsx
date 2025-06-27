'use client';
import React, { useEffect, useState } from 'react';
import styles from '../../../style/ForgotPassword.module.css';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import API from '@/utils/axios';
import InvalidToken from './InvalidToken';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const validatingToken = async () => {
      try {
        const res = await API.post('/api/validate-token', { token });
        if (res.valid.data) {
          setStatus('valid');
        } else {
          setStatus('invalid');
        }
      } catch (error) {
        console.error(err);
        setStatus('invalid');
      }
    };
    if (token) {
      validatingToken();
    } else {
      setStatus('invalid');
    }
  }, [token]);
  if (status === 'invalid') return <InvalidToken message={status} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const res = await API.post('/api/forgotPassword', { email, newPassword });
      console.log(res);
      console.log(res.data);
      const { user } = res.data.user;

      console.log(user.userName, user.email);

      if (!user.userName || !user.email) {
        throw new Error('something went wrong');
      }
      alert(
        'Password reset successful! You can now log in with your new password.',
      );
      router.push('/login');
    } catch (error) {
      console.error('Reset error:', error);
      alert('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Email verified please login</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
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
