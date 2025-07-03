'use client';
import styles from './Sidebar.module.css';

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <nav>
          <ul>
            <li>
              <a href="/company/profile">Profile</a>
            </li>
            <li>
              <a href="/company/competitions">Competitions</a>
            </li>
            <li>
              <a href="/company/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="/company/settings">Settings</a>
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
