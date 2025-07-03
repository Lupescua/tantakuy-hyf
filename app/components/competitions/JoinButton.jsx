'use client';

import Link from 'next/link';
import styles from '../../competition/competition.module.css';
import { useAuth } from '@/context/AuthContext';

/**
 * “DEL­TAG HER” button
 * – Logged-in  →  /participant-entry
 * – Guest      →  /login
 */
export default function JoinButton() {
  const { user, loading } = useAuth();

  // While auth state is loading we just render a disabled-looking span.
  if (loading) {
    return (
      <div className={styles.buttonWrapper}>
        <span className={`${styles.joinButton} ${styles.disabled}`}>…</span>
      </div>
    );
  }

  // Decide destination based on presence of user
  const href = user ? '/participant-entry' : '/login';

  return (
    <div className={styles.buttonWrapper}>
      <Link href={href} className={styles.joinButton}>
        DELTAG&nbsp;HER
        {/* if you are confused like me, "&nbsp" Keeps the two words stuck together so they can’t break at a newline.*/}
      </Link>
    </div>
  );
}
