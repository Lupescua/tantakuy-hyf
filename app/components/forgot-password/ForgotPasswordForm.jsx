'use client';

import React, { useState } from 'react';
import styles from '../../../style/ForgotPassword.module.css';
import API from '@/utils/axios';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      const res = await API.post('/request-reset', { email });

      if (res.data.success) {
        setStatus('If your email is registered, a reset link has been sent.');
      } else {
        setStatus('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Server error. Please try again later.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Forgot Password?</h2>
        <p>
          Enter your email address and we'll send you a link to reset your
          password. The link will expire in 15 minutes for security.
        </p>
        <label className={styles.label}>Enter your email address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>
          Next →
        </button>
        <a href="/login" className={styles.link}>
          Back to Log in
        </a>
        {status && <p>{status}</p>}
      </form>
    </div>
  );
}
