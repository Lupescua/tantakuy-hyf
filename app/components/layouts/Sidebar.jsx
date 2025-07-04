'use client';
import styles from './Sidebar.module.css';

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <nav>
          <h2 className={styles.sidebarTitle}>Overview</h2>
          <ul className={styles.sidebarList}>
            <li>
              <a className={styles.sidebarButton} href="/company/profile">Virksomhedsoplysninger</a>
            </li>
            <li>
              <a className={styles.sidebarButton} href="/company/competitions">Mine konkurrencer</a>
            </li>
            <li>
              <a className={styles.sidebarButton} href="/company/dashboard">Kontrolpanel</a>
            </li>
            <li>
              <a className={styles.sidebarButton} href="/company/settings">Indstillinger</a>
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
