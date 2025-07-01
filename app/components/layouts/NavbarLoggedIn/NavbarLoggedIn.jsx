'use client';
import Link from 'next/link';
import styles from './NavbarLoggedIn.module.css';
import { useRouter } from 'next/router';
import API from '@/utils/axios';

export default function NavbarLoggedIn() {
  const handleLogout = async () => {
    const res = API.post('/logout');

    router.push('/login');
  };
  return (
    <header className={styles.navbar}>
      <div className={styles['navbar-container']}>
        <div className={`${styles['navbar-top']} ${styles['fade-in']}`}>
          <h1 className={styles['site-title']}>Tantakuy</h1>
          <div className={styles['auth-buttons']}>
            {/* <Link href="/login" className={styles['nav-btn']}>
              Log in
            </Link> */}
            <span>Welcome! </span>
            <button
              onClick={handleLogout}
              className={`${styles['nav-btn']} ${styles.primary}`}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
