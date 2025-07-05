'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function UserProfileSidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <ul>
        <li
          className={pathname === '/participant/profile' ? styles.active : ''}
        >
          <Link href="/participant/profile">Min profil</Link>
        </li>
        <li
          className={pathname === '/participant/settings' ? styles.active : ''}
        >
          <Link href="/participant/settings">Indstillinger</Link>
        </li>
        <li className={pathname === '/participant/help' ? styles.active : ''}>
          <Link href="/participant/help">Hjælp</Link>
        </li>
      </ul>
    </nav>
  );
}
