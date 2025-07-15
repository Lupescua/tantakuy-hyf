import Link from 'next/link';
import { FiInstagram, FiHome, FiSearch, FiHeart, FiUser } from 'react-icons/fi';
import styles from './FooterLoggedIn.module.css';
import { useMobileSearch } from '../../../../context/MobileSearchContext';
import { useAuth } from '../../../../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import API from '@/utils/axios';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const { toggleMobileSearch } = useMobileSearch();
  const { user, refresh } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  // Cerrar el menú si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Función para logout igual que en CompanyProfileNavbar
  const handleLogout = async () => {
    try {
      await API.post('/logout');
      refresh();
      router.replace('/');
      setShowMenu(false);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Ruta de perfil según rol
  let profileHref = '/';
  if (user) {
    if (user.role === 'participant') {
      profileHref = `/participant/${user.id}/profile`;
    } else if (user.role === 'company') {
      profileHref = `/company/${user.id}/profile`;
    }
  }

  return (
    <footer className={styles.footer}>
      {/* footer desktop */}
      <div className={styles['footer-content']}>
        <p className={styles['footer-text']}>
          © 2025 Tantakuy. Alle rettigheder forbeholdes.
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

      {/* footer mobile */}
      <nav className={styles['footer-nav']} aria-label="Mobile navigation">
        <Link href="/" aria-label="Home" className={styles['footer-icon']}>
          <FiHome />
        </Link>
        <button
          className={styles['footer-icon']}
          aria-label="Search"
          onClick={toggleMobileSearch}
        >
          <FiSearch />
        </button>
        <button className={styles['footer-icon']} aria-label="Synes godt om">
          <FiHeart />
        </button>
        <div style={{ position: 'relative' }}>
          <button
            className={styles['footer-icon']}
            aria-label="Profil"
            onClick={() => setShowMenu((v) => !v)}
          >
            <FiUser />
          </button>
          {showMenu && (
            <div ref={menuRef} className={styles.profileMenu}>
              <Link href={profileHref} className={styles.profileMenuBtn} onClick={() => setShowMenu(false)}>
                My Profile
              </Link>
              <button className={styles.profileMenuBtn} onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </nav>
    </footer>
  );
}
