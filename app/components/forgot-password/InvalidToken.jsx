'use client';

import React, { useEffect, useState } from 'react';
import styles from '../../../style/ForgotPassword.module.css';
import { useRouter } from 'next/navigation';

export default function InvalidToken({ message }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          router.push('/login');
          clearInterval(interval);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className={styles.centeredContainer}>
      <div className={styles.leftAlignText}>
        <p className={styles.message}>{message}</p>
        <a href="/login" className={styles.backLink}>
          Tilbage til log ind
        </a>
        <h1 className={styles.countDown}>{countdown}</h1>
        <div className={styles.spinner}></div>
      </div>
    </div>
  );
}
