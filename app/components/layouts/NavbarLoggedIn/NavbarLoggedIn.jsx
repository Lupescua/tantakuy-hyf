import Link from 'next/link';
import styles from './NavbarLoggedOut.module.css';

export default function NavbarLoggedOut() {
  return (
    <header className={styles.navbar}>
      <div className={styles['navbar-container']}>
        <div className={`${styles['navbar-top']} ${styles['fade-in']}`}>
          <h1 className={styles['site-title']}>Tantakuy</h1>
          <div className={styles['auth-buttons']}>
            <Link href="/login" className={styles['nav-btn']}>
              Log in
            </Link>
            <Link href="/signup" className={`${styles['nav-btn']} ${styles.primary}`}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
