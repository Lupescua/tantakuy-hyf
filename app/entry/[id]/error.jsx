'use client';

import { useEffect } from 'react';
import styles from '../../error.module.css';

export default function EntryError({ error, reset }) {
  useEffect(() => {
    console.error('Entry page error:', error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorTitle}>Bidrag ikke tilgængeligt</h1>
        <p className={styles.errorMessage}>
          Vi kunne ikke indlæse dette bidrag. Det kan være slettet eller
          utilgængeligt.
        </p>
        <div className={styles.errorActions}>
          <button onClick={() => reset()} className={styles.retryButton}>
            Prøv igen
          </button>
          <a href="/" className={styles.homeButton}>
            Se alle konkurrencer
          </a>
        </div>
      </div>
    </div>
  );
}
