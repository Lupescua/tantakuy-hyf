import Link from 'next/link';
import styles from './FooterLoggedOut.module.css';

export default function FooterLoggedOut() {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-content']}>
        <p className={styles['footer-text']}>Do you have an account?</p>

        <div className={styles['footer-auth-buttons']}>
          <Link
            href="/login"
            className={`${styles['footer-btn']} ${styles['login-btn']}`}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className={`${styles['footer-btn']} ${styles['signup-btn']}`}
          >
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  );
}
