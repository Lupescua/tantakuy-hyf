'use client';
import UserProfileSidebar from '../../components/participantProfilePage/Sidebar';
import ProfileSection from '../../components/participantProfilePage/ProfileSection';
import NotificationsPanel from '../../components/participantProfilePage/NotificationPanel';
import styles from './userProfile.module.css';

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
