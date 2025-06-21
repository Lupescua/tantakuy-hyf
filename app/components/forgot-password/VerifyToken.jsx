'use client';

import React, { useEffect } from 'react';
import styles from '../../../style/ForgotPassword.module.css';
import { useRouter } from 'next/navigation';

export default function VerifyToken() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/forgot-password?step=reset');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.centeredContainer}>
      <div className={styles.leftAlignText}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>
          Please wait while we confirm your email token
        </p>
        <a href="/login" className={styles.backLink}>
          Back to Log in
        </a>
      </div>
    </div>
  );
}
