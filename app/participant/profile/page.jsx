'use client';
import UserProfileSidebar from '@/app/components/participantProfilePage/Sidebar';
import ProfileSection from '@/app/components/participantProfilePage/ProfileSection';
import NotificationsPanel from '@/app/components/participantProfilePage/NotificationPanel';
import HelpSection from '@/app/components/participantProfilePage/HelpSection';
import SettingsSection from '@/app/components/participantProfilePage/SettingsSection';
import styles from './userProfile.module.css';
import { useState } from 'react';

export default function UserProfile() {
  const [section, setSection] = useState('profile');
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <UserProfileSidebar currentSection={section} setSection={setSection} />
      </aside>

      <main className={styles.main}>
        {section === 'profile' && <ProfileSection />}
        {section === 'settings' && <SettingsSection />}
        {section === 'help' && <HelpSection />}
      </main>

      <aside className={styles.notifications}>
        <NotificationsPanel />
      </aside>
    </div>
  );
}
