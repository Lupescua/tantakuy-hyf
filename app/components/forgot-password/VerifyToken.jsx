'use client';

import React, { useEffect, useState } from 'react';
import styles from '../../../style/ForgotPassword.module.css';
import { useRouter } from 'next/navigation';

export default function VerifyToken() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  // 1) kick off the decrement loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // 2) when countdown reaches 0, navigate
  useEffect(() => {
    if (countdown <= 0) {
      router.push('/login');
    }
  }, [countdown, router]);

  return (
    <div className={styles.centeredContainer}>
      <div className={styles.leftAlignText}>
        <p className={styles.message}>
          Hvis din email er registreret, er der sendt et nulstillingslink. Tjek
          venligst din indbakke.
        </p>
        <a href="/login" className={styles.backLink}>
          Tilbag til Log in
        </a>
        <h1 className={styles.countDown}>{countdown}</h1>
        <div className={styles.spinner}></div>
      </div>
    </div>
  );
}
