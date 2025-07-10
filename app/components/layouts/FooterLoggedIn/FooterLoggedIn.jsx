'use client';
import Link from 'next/link';
import { FiInstagram, FiHome, FiSearch, FiHeart, FiUser } from 'react-icons/fi';
import styles from './FooterLoggedIn.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const router = useRouter();
  const { user } = useAuth();

  const goToProfile = () => {
    if (user?.id) {
      router.push(`/participant/${user.id}/profile`);
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
        <button
          className={styles['footer-icon']}
          aria-label="Profile"
          onClick={goToProfile}
        >
          <FiUser />
        </button>
      </nav>
    </footer>
  );
}
