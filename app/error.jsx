'use client';

import { useEffect } from 'react';
import styles from './error.module.css';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorTitle}>Noget gik galt</h1>
        <p className={styles.errorMessage}>
          Der opstod en uventet fejl. Prøv venligst igen.
        </p>
        <div className={styles.errorActions}>
          <button onClick={() => reset()} className={styles.retryButton}>
            Prøv igen
          </button>
          <a href="/" className={styles.homeButton}>
            Gå til forsiden
          </a>
        </div>
      </div>
    </div>
  );
}
