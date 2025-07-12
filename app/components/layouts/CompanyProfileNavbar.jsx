'use client';
import { FaBell, FaCog, FaBars } from 'react-icons/fa';
import styles from './CompanyProfileNavbar.module.css';
import { useAuth } from '@/context/AuthContext';
import API from '@/utils/axios';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CompanyProfileNavbar({ onHamburgerClick }) {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 📦 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🚪 Logout logic
  const handleLogout = async () => {
    try {
      await API.post('/logout');
      refresh();
      router.replace('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={styles['navbar-inner']}>
        <div className={styles.left}>
          <button
            className={styles.menuButton}
            onClick={onHamburgerClick}
            aria-label="Open sidebar menu"
          >
            <FaBars />
          </button>
          <span className={styles.logo}>TANTAKUY</span>
        </div>

        <div className={styles.center}>
          <button className={styles.companyDropdown}>{user.userName}▼</button>
          <Link
            href={`/company/${user.id}/competitions`}
            onClick={() => setProfileMenuOpen(false)}
            className={styles.competitions}
          >
            Competitions
          </Link>
        </div>

        <div className={styles.right}>
          {/* Dropdown Trigger and Container - still has a bug of not being in the foreground*/}
          <div className={styles['profile-menu-container']} ref={dropdownRef}>
            <button
              className={styles.idCircle}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Open profile menu"
            >
              {user.userName[0].toUpperCase()}
            </button>

            {menuOpen && (
              <div className={styles['profile-menu-dropdown']}>
                {/* Add other links here if needed */}

                <br />
                <Link
                  href={`/company/${user.id}/profile`}
                  onClick={() => setProfileMenuOpen(false)}
                  className={styles['dropdown-link']}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className={styles['logout-btn']}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
          <FaBell className={styles.icon} />
          <Link
            href={`/company/${user.id}/settings`}
            onClick={() => setProfileMenuOpen(false)}
            className={styles['dropdown-link']}
          >
            <FaCog className={styles.icon} />
          </Link>
        </div>
      </div>
    </header>
  );
}
