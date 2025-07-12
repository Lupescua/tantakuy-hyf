'use client';

import Link from 'next/link';
import styles from '../../competitions/competition.module.css';
import { useAuth } from '@/context/AuthContext';
import Loader from '../loader/Loader';

/**
 * “DEL­TAG HER” button
 * – Logged-in  →  /participant-entry/[competitionId]
 * – Guest      →  /login
 */
export default function JoinButton({ competitionId }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.buttonWrapper}>
        <span className={`${styles.joinButton} ${styles.disabled}`}>
          <Loader />
        </span>
      </div>
    );
  }

  // if logged in, point at the dynamic route
  const href = user ? `/participant-entry/${competitionId}` : '/login';

  return (
    <div className={styles.buttonWrapper}>
      <Link href={href} className={styles.joinButton}>
        DELTAG&nbsp;HER
      </Link>
    </div>
  );
}
