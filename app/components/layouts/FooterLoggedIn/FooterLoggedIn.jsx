'use client';
import Link from 'next/link';
import { FiInstagram, FiHome, FiSearch, FiHeart, FiUser } from 'react-icons/fi';
import styles from './FooterLoggedIn.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import API from '@/utils/axios';

export default function Footer() {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToProfile = () => {
    if (user?.id) {
      router.push(`/participant/${user.id}/profile`);
    }
  };

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

  return (
    <footer className={styles.footer}>
      {/* footer desktop */}
      <div className={styles['footer-content']}>
        <p className={styles['footer-text']}>
          © 2025 Tantakuy. All rights reserved.
        </p>
        <div className={styles['footer-socials']}>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FiInstagram />
          </a>
        </div>
      </div>

      {/* footer móvil */}
      <nav className={styles['footer-nav']} aria-label="Mobile navigation">
        <Link href="/" aria-label="Home" className={styles['footer-icon']}>
          <FiHome />
        </Link>
        <button className={styles['footer-icon']} aria-label="Search">
          <FiSearch />
        </button>
        <button className={styles['footer-icon']} aria-label="Likes">
          <FiHeart />
        </button>
        <div className={styles['footer-profile-menu-container']} ref={dropdownRef}>
          <button
            className={styles['footer-icon']}
            aria-label="Profile"
            onClick={() => setProfileMenuOpen((open) => !open)}
          >
            <FiUser />
          </button>
          {profileMenuOpen && (
            <div className={styles['footer-profile-menu-dropdown']}>
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  goToProfile();
                }}
                className={styles['dropdown-link']}
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  handleLogout();
                }}
                className={styles['logout-btn']}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </nav>
    </footer>
  );
}
