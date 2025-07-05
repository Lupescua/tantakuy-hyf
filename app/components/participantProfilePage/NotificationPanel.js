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
    if (!user?._id) return;

    const fetchNotifications = async () => {
      try {
        const res = await API.get('/notification', {
          params: { userId: user._id },
        });
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.bell} onClick={togglePanel}>
        <FaBell />
        {notifications.length > 0 && <span className={styles.dot}></span>}
      </div>

      {(open || !styles.isMobile) && (
        <div className={`${styles.panel} ${open ? styles.show : ''}`}>
          <h3>Notifications</h3>

          {notifications.length === 0 ? (
            <p className={styles.empty}>No notifications</p>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className={styles.notification}>
                <div className={styles.dot}></div>
                <p>
                  <strong>{n.actor.userName}</strong>{' '}
                  {n.type === 'like' ? 'liked' : 'shared'} your entry
                </p>
                <Link
                  href={`/entry/${n.entry._id}`}
                  className={styles.naviToEntry}
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
