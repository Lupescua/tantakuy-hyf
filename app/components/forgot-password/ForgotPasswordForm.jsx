'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../style/ForgotPassword.module.css';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    router.push('/forgot-password?step=verify');
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Forgot Password?</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur. Diam amet sed eget in magna
          lacus.
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
      </form>
    </div>
  );
}
