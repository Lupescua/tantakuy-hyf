'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import API from '@/utils/axios';
import styles from './NavbarLoggedIn.module.css';
import { useAuth } from '@/context/AuthContext';

export default function NavbarLoggedIn() {
  const pathname = usePathname();
  const router = useRouter();
  const { refresh } = useAuth();

  const handleLogout = async () => {
    try {
      await API.post('/logout');
      refresh();
      router.push('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };
  //disable this navbar for company profile so that the layout there handles it
  if (pathname.startsWith('/company/profile')) {
    return null;
  }

  return (
    <header className={styles.navbar}>
      <div className={styles['navbar-container']}>
        <div className={`${styles['navbar-top']} ${styles['fade-in']}`}>
          <Link href={'/'}>
            <h1 className={styles['site-title']}>Tantakuy</h1>
          </Link>
          <div className={styles['auth-buttons']}>
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
