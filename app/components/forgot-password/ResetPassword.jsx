'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import API from '@/utils/axios';
import styles from '../../../style/ForgotPassword.module.css';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  const token = searchParams.get('token');
  const [email, setEmail] = useState(emailParam || '');
  const [status, setStatus] = useState('loading');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  // 1) validate token...
  useEffect(() => {
    if (!emailParam || !token) {
      setStatus('invalid');
      return;
    }
    async function validate() {
      try {
        const res = await API.post('/validate-token', {
          email: emailParam,
          token,
        });
        setStatus(res.data.success ? 'valid' : 'invalid');
      } catch {
        setStatus('invalid');
      }
    }
    validate();
  }, [emailParam, token]);

  if (status === 'invalid') {
    return (
      <div className={styles.centeredContainer}>
        <p>Dit link er ugyldigt eller udløbet. Du bliver sendt til login.</p>
      </div>
    );
  }
  if (status === 'loading') {
    return (
      <div className={styles.centeredContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  // 2) submit new password
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Adgangskoderne matcher ikke');
      return;
    }
    try {
      await API.post('/forgotPassword', {
        email: emailParam,
        newPassword,
        token,
      });
      alert(
        'Adgangskode nulstillet! Du kan nu logge ind med din nye adgangskode.',
      );
      router.push('/login');
    } catch (err) {
      console.error(err);
      alert('Noget gik galt. Prøv igen.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Nulstil adgangskode</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* show which email we’re resetting for */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={emailParam}
            disabled
            className={styles.disabledInput}
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

        <button type="submit" className={styles.submitButton}>
          Nulstil adgangskode →
        </button>
      </form>
    </div>
  );
}
