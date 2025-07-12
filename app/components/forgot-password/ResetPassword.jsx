'use client';
import React, { useEffect, useState } from 'react';
import styles from '../../../style/ForgotPassword.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import API from '@/utils/axios';
import InvalidToken from './InvalidToken';
import { AppError } from '@/utils/errorHandler';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');
  const [status, setStatus] = useState('loading');
  console.log(emailParam);
  useEffect(() => {
    const validatingToken = async () => {
      try {
        const res = await API.post('/validate-token', {
          email: emailParam,
          token: token,
        });
        if (res.status) {
          setStatus('valid');
        } else {
          setStatus('invalid');
        }
      } catch (error) {
        setStatus('invalid');
      }
    };
    if (emailParam && token) {
      validatingToken();
    } else {
      setStatus('invalid'); // Invalid if params are missing
    }
  }, [emailParam, token]);

  if (status === 'invalid') return <InvalidToken message={status} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await API.post('/forgotPassword', {
        email,
        newPassword,
        token,
      });

      const { user } = res.data.user;

      if (!user.userName || !user.email) {
        throw new AppError('Missing user data', 400);
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
      <h1 className={styles.title}>
        Email verified, please reset your password
      </h1>
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
          <label className={styles.label}>Ny adgangskode</label>
          <input
            type="password"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Bekræft adgangskode</label>
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
            Husk mig
          </label>
        </div>

        <button type="submit" className={styles.submitButton}>
          Nulstil adgangskode →
        </button>
      </form>
    </div>
  );
}
