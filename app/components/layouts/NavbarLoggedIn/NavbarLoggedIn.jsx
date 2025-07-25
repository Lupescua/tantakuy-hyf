'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import API from '@/utils/axios';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import NotificationsPanel from '@/app/components/participantProfilePage/NotificationPanel';
import styles from './NavbarLoggedIn.module.css';

export default function NavbarLoggedIn({ user }) {
  const { refresh } = useAuth();
  const router = useRouter();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const userId = user?.id;

  // Early return if no user to prevent hydration issues
  if (!user) {
    return null;
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout and refresh UI
  const handleLogout = async () => {
    try {
      await API.post('/logout');
      refresh();
      router.replace('/');
      router.refresh();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };
  //disable this navbar for company profile so that the layout there handles it
  if (pathname.startsWith('/company')) {
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
            <div className={styles['notification-wrapper']}>
              <NotificationsPanel />
            </div>
            <div className={styles['profile-menu-container']} ref={dropdownRef}>
              {' '}
              <button
                className={styles['nav-btn']}
                onClick={() => setProfileMenuOpen((open) => !open)}
              >
                {user?.userName?.[0]?.toUpperCase() || 'U'}
              </button>
              {profileMenuOpen && (
                <div className={styles['profile-menu-dropdown']}>
                  <Link
                    href={
                      user.role === 'company'
                        ? `/company/${userId}/profile`
                        : `/participant/${userId}/profile`
                    }
                    onClick={() => setProfileMenuOpen(false)}
                    className={styles['dropdown-link']}
                  >
                    Min profil
                  </Link>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleLogout();
                    }}
                    className={`${styles['logout-btn']}`}
                  >
                    Log ud
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
