import Link from 'next/link';
import { FiInstagram, FiHome, FiSearch, FiHeart, FiUser } from 'react-icons/fi';
import styles from './FooterLoggedIn.module.css';
import { useMobileSearch } from '../../../../context/MobileSearchContext';

export default function Footer() {
  const { toggleMobileSearch } = useMobileSearch();
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

      {/* footer mobil */}
      <nav className={styles['footer-nav']} aria-label="Mobil navigation">
        <Link href="/" aria-label="Hjem" className={styles['footer-icon']}>
          <FiHome />
        </Link>
        <button className={styles['footer-icon']} aria-label="Søg" onClick={toggleMobileSearch}>
          <FiSearch />
        </button>
        <button className={styles['footer-icon']} aria-label="Synes godt om">
          <FiHeart />
        </button>
        <button className={styles['footer-icon']} aria-label="Profil">
          <FiUser />
        </button>
      </nav>
    </footer>
  );
}
