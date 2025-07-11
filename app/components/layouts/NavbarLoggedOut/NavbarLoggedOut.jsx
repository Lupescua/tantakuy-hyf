import Link from 'next/link';
import styles from './NavbarLoggedOut.module.css';

export default function NavbarLoggedOut() {
  return (
    <header className={styles.navbar}>
      <div className={styles['navbar-container']}>
        <Link href="/" className={styles['site-title']}>
          Tantakuy
        </Link>
        <div className={styles['auth-buttons']}>
          <Link href="/login" className={styles['nav-btn']}>
            Log ind
          </Link>
          <Link
            href="/signup"
            className={`${styles['nav-btn']} ${styles['primary']}`}
          >
            Tilmeld dig
          </Link>
        </div>
      </div>
    </header>
  );
}
