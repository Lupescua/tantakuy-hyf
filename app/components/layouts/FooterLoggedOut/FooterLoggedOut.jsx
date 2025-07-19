import Link from 'next/link';
import styles from './FooterLoggedOut.module.css';
import { usePathname } from 'next/navigation';

export default function FooterLoggedOut() {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-content']}>
        <p className={styles['footer-text']}>
          Har du en konto?{' '}
          <Link href="/login" className={styles['footer-btn']}>
            Log ind
          </Link>{' '}
          eller{' '}
          <Link
            href="/signup"
            className={`${styles['footer-btn']} ${styles['footer-btn']} ${styles['primary']}`}
          >
            Sign up
          </Link>
        </p>
      </div>
    </footer>
  );
}
