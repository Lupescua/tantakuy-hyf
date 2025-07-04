import styles from './Sidebar.module.css';

export default function UserProfileSidebar({ currentSection, setSection }) {
  return (
    <nav className={styles.nav}>
      <ul>
        <li
          className={currentSection === 'profile' ? styles.active : ''}
          onClick={() => setSection('profile')}
        >
          Min profil
        </li>
        <li
          className={currentSection === 'settings' ? styles.active : ''}
          onClick={() => setSection('settings')}
        >
          Indstillinger
        </li>
        <li
          className={currentSection === 'help' ? styles.active : ''}
          onClick={() => setSection('help')}
        >
          Hjælp
        </li>
      </ul>
    </nav>
  );
}
