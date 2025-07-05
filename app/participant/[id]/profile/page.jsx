'use client';
import UserProfileSidebar from '@/app/components/participantProfilePage/Sidebar';
import ProfileSection from '@/app/components/participantProfilePage/ProfileSection';
import NotificationsPanel from '@/app/components/participantProfilePage/NotificationPanel';
import HelpSection from '@/app/components/participantProfilePage/HelpSection';
import SettingsSection from '@/app/components/participantProfilePage/SettingsSection';
import styles from './page.module.css';
import { useState } from 'react';

export default function UserProfile() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <UserProfileSidebar />
      </aside>

      <main className={styles.main}>
        <ProfileSection />
      </main>

      <aside className={styles.notifications}>
        <NotificationsPanel />
      </aside>
    </div>
  );
}
