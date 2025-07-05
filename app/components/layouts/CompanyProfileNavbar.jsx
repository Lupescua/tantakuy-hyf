'use client';
import { FaBell, FaCog, FaBars } from 'react-icons/fa';
import styles from './CompanyProfileNavbar.module.css';
import { useAuth } from '@/context/AuthContext';
import API from '@/utils/axios';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

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
          <span className={styles.competitions}>Competitions</span>
        </div>

        <div className={styles.right}>
          <span className={styles.idCircle}>ID</span>
          <span className={styles.user}>User</span>
          <FaBell className={styles.icon} />

          {/* Dropdown Trigger and Container - still has a bug of not being in the foreground*/}
          <div className={styles['profile-menu-container']} ref={dropdownRef}>
            <button
              className={styles.iconButton}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Settings"
            >
              <FaCog className={styles.icon} />
            </button>

            {menuOpen && (
              <div className={styles['profile-menu-dropdown']}>
                {/* Add other links here if needed */}
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
        </div>
      </div>
    </header>
  );
}
