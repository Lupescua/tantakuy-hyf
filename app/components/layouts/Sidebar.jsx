'use client';
import styles from './Sidebar.module.css';
import { FaRegBuilding, FaBars, FaThLarge, FaRegUser } from 'react-icons/fa';

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <nav>
          <h2 className={styles.sidebarTitle}>Overview</h2>
          <ul className={styles.sidebarList}>
            <li>
              <a className={styles.sidebarButton} href="/company/profile">
                Virksomhedsoplysninger
              </a>
            </li>
            <li>
              <a className={styles.sidebarButton} href="/company/competitions">
                <FaBars style={{ marginRight: '8px' }} />
                Mine konkurrencer
              </a>
            </li>
            <li>
              <a className={styles.sidebarButton} href="/company/dashboard">
                <FaThLarge style={{ marginRight: '8px' }} />
                Dashboard
              </a>
            </li>
            <li>
              <a className={styles.sidebarButton} href="/company/settings">
                <FaRegUser style={{ marginRight: '8px' }} />
                Indstillinger
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Overlay for closing sidebar on click */}
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      )}
    </>
  );
}
