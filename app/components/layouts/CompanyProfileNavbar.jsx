'use client';
import { FaBell, FaCog, FaBars } from 'react-icons/fa';
import styles from './CompanyProfileNavbar.module.css';

export default function CompanyProfileNavbar({ onHamburgerClick }) {
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
          <button className={styles.companyDropdown}>Company name ▼</button>
          <span className={styles.competitions}>Competitions</span>
        </div>
        <div className={styles.right}>
          <span className={styles.idCircle}>ID</span>
          <span className={styles.user}>User</span>
          <FaBell className={styles.icon} />
          <FaCog className={styles.icon} />
        </div>
      </div>
    </header>
  );
}
