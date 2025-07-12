'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../style/ForgotPassword.module.css';
import API from '@/utils/axios';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setStatus('Indtast venligst en gyldig emailadresse.');
      return;
    }
    try {
      const res = await API.post('/request-reset', { email });

      if (res.data.success) {
        router.push(
          `/forgot-password?step=verify&email=${encodeURIComponent(email)}`,
        );
      } else {
        setStatus('Noget gik galt. Prøv venligst igen.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Serverfejl. Prøv venligst igen senere.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Glemt adgangskode?</h2>
        <p>
          Indtast din emailadresse, så sender vi dig et link til at nulstille
          din adgangskode. Linket udløber om 15 minutter af sikkerhedshensyn.
        </p>
        <label className={styles.label}>Indtast din emailadresse</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>
          Næste →
        </button>
        <a href="/login" className={styles.link}>
          Tilbage til log ind
        </a>
        {status && <p>{status}</p>}
      </form>
    </div>
  );
}
