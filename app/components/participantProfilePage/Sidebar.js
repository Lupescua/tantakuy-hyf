'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function UserProfileSidebar({ participantId }) {
  const pathname = usePathname();

  // To check active item, see if pathname ends with each section
  const isProfileActive = pathname.endsWith('/profile');
  const isSettingsActive = pathname.endsWith('/settings');
  const isHelpActive = pathname.endsWith('/help');

  return (
    <nav className={styles.nav}>
      <ul>
        <li className={isProfileActive ? styles.active : ''}>
          <Link href={`/participant/${participantId}/profile`}>Min profil</Link>
        </li>
        <li className={isSettingsActive ? styles.active : ''}>
          <Link href={`/participant/${participantId}/settings`}>
            Indstillinger
          </Link>
        </li>
        <li className={isHelpActive ? styles.active : ''}>
          <Link href={`/participant/${participantId}/help`}>Hjælp</Link>
        </li>
      </ul>
    </nav>
  );
}
