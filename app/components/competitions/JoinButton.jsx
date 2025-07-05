'use client';

import Link from 'next/link';
import styles from '../../competition/competition.module.css';
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

  console.log('JoinButton → linking to:', href);

  return (
    <div className={styles.buttonWrapper}>
      <Link href={href} className={styles.joinButton}>
        DELTAG&nbsp;HER
        {/* if you are confused like me, "&nbsp" Keeps the two words stuck together so they can’t break at a newline.*/}
      </Link>
    </div>
  );
}
