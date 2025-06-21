import Link from 'next/link';
import { FiInstagram, FiHome, FiSearch, FiHeart, FiUser } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="footer">
        
      {/* footer desktop */}
      <div className="footer-content">
        <p className="footer-text">© 2025 Tantakuy. All rights reserved.</p>
        <div className="footer-socials">
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FiInstagram />
          </a>
        </div>
      </div>

      {/* footer movil */}
      <nav className="footer-nav" aria-label="Mobile navigation">
        <Link href="/" aria-label="Home" className="footer-icon">
          <FiHome />
        </Link>
        <button className="footer-icon" aria-label="Search">
          <FiSearch />
        </button>
        <button className="footer-icon" aria-label="Likes">
          <FiHeart />
        </button>
        <button className="footer-icon" aria-label="Profile">
          <FiUser />
        </button>
      </nav>
    </footer>
  );
}
