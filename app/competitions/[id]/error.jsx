'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from '../../error.module.css';

export default function CompetitionError({ error, reset }) {
  useEffect(() => {
    console.error('Competition page error:', error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorTitle}>Konkurrence ikke tilgængelig</h1>
        <p className={styles.errorMessage}>
          Vi kunne ikke indlæse denne konkurrence. Den kan være slettet eller
          utilgængelig.
        </p>
        <div className={styles.errorActions}>
          <button onClick={() => reset()} className={styles.retryButton}>
            Prøv igen
          </button>
          <Link href="/" className={styles.homeButton}>
            Se alle konkurrencer
          </Link>
        </div>
      </div>
    </div>
  );
}
