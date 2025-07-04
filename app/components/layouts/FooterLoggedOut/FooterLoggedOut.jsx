import Link from 'next/link';
import styles from './FooterLoggedOut.module.css';

export default function FooterLoggedOut() {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-content']}>
        <p className={styles['footer-text']}>Do you have an account?</p>
      </div>
    </footer>
  );
}
