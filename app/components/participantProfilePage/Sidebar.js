'use client';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function UserProfileSidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <ul>
        <li className={pathname === '/participant/profile' ? styles.active : ''}>
          Min profil
        </li>
        <li className={pathname === '/participant/settings' ? styles.active : ''}>
          Indstillinger
        </li>
        <li className={pathname === '/participant/help' ? styles.active : ''}>
          Hjælp
        </li>
      </ul>
    </nav>
  );
}
