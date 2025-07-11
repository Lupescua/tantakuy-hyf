'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import UserProfileSidebar from '@/app/components/participantProfilePage/Sidebar';
import ProfileSection from '@/app/components/participantProfilePage/ProfileSection';
import NotificationsPanel from '@/app/components/participantProfilePage/NotificationPanel';
import styles from './page.module.css';

export default function UserProfile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'participant' || user.id !== id) {
      router.replace('/');
    }
  }, [loading, user, id, router]);

  if (loading || !user || user.role !== 'participant' || user.id !== id) {
    return null;
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <UserProfileSidebar participantId={user.id} />
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
