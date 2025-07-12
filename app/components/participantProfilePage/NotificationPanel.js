'use client';
import { useState, useEffect } from 'react';
import styles from './NotificationPanel.module.css';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import API from '@/utils/axios';
import Link from 'next/link';

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  const togglePanel = () => setOpen(!open);

  useEffect(() => {
    if (!user?.id) return;
    const fetchNotifications = async () => {
      try {
        const res = await API.get('/notification', {
          params: { userId: user.id },
        });
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();
  }, [user]);

  // Remove clicked notification
  const handleNotificationClick = async (id) => {
    try {
      await API.delete(`/notification/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  // Clear all notifications from panel
  const handleClearAll = async () => {
    try {
      await API.delete(`/notification`, {
        params: { userId: user.id },
      });
      setNotifications([]);
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.bell} onClick={togglePanel}>
        <FaBell />
        {notifications.length > 0 && <span className={styles.dot}></span>}
      </div>

      {(open || !styles.isMobile) && (
        <div className={`${styles.panel} ${open ? styles.show : ''}`}>
          <div className={styles.header}>
            <h3>Notifikationer</h3>
            {notifications.length > 0 && (
              <button onClick={handleClearAll} className={styles.clearButton}>
                Ryd alle
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className={styles.empty}>Ingen notifikationer</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={styles.notification}>
                <div className={styles.dot}></div>
                <p>
                  <strong>{n.actor.userName}</strong>{' '}
                  {n.type === 'like' ? 'synes godt om' : 'delte'} dit indlæg
                </p>
                <Link
                  href={`/entry/${n.entry.id}`}
                  className={styles.naviToEntry}
                  onClick={() => handleNotificationClick(n.id)}
                >
                  {'>'}
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
