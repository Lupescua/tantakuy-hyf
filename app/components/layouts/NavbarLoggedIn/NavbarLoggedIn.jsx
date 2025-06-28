import Link from 'next/link';
import styles from './NavbarLoggedIn.module.css';

export default function NavbarLoggedIn({user}) {
  return (
    <header className={styles.navbar}>
      <div className={styles['navbar-container']}>
        <div className={`${styles['navbar-top']} ${styles['fade-in']}`}>
          <h1 className={styles['site-title']}>Tantakuy</h1>
          <div className={styles['auth-buttons']}>
            {/* <Link href="/login" className={styles['nav-btn']}>
              Log in
            </Link> */}
             <span>Welcome {user.userName}!     </span>
            {/* <Link
              href="/profile"
              className={`${styles['nav-btn']} ${styles.primary}`}
            >
              Profile
            </Link> */}
          </div>
        </div>
      </div>
    </header>
  );
}
