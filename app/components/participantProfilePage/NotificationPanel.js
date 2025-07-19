'use client';
import { useState, useEffect } from 'react';
import styles from './NotificationPanel.module.css';
import { FaBell, FaTrophy, FaHeart, FaShareAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import API from '@/utils/axios';
import Link from 'next/link';

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  const togglePanel = () => setOpen((o) => !o);

  useEffect(() => {
    if (!user?.id) return;
    API.get('/notification', { params: { userId: user.id } })
      .then((res) => setNotifications(res.data.notifications || []))
      .catch((err) => console.error('Failed to fetch notifications:', err));
  }, [user]);

  const handleNotificationClick = async (id) => {
    try {
      await API.delete(`/notification/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await API.delete('/notification', { params: { userId: user.id } });
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

      {open && (
        <div className={`${styles.panel} ${styles.show}`}>
          <div className={styles.header}>
            <h3>Notifikationer</h3>
          </div>

          <div className={styles.notificationsContainer}>
            {notifications.length === 0 ? (
              <p className={styles.empty}>Ingen notifikationer</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={styles.notification}>
                  <div className={styles.dot}></div>
                  {n.type === 'win' ? (
                    <>
                      <FaTrophy className={styles.icon} />
                      <p>
                        Tillykke! Du har vundet konkurrencen “
                        {n.competition.title}”!
                      </p>
                      <Link
                        href={`/competition/${n.competition.id}`}
                        className={styles.naviToEntry}
                        onClick={() => handleNotificationClick(n.id)}
                      >
                        &gt;
                      </Link>
                    </>
                  ) : n.type === 'like' ? (
                    <>
                      <FaHeart className={styles.icon} />
                      <p>
                        <strong>{n.actor.userName}</strong> synes godt om dit
                        indlæg.
                      </p>
                      <Link
                        href={`/entry/${n.entry.id}`}
                        className={styles.naviToEntry}
                        onClick={() => handleNotificationClick(n.id)}
                      >
                        &gt;
                      </Link>
                    </>
                  ) : n.type === 'share' ? (
                    <>
                      <FaShareAlt className={styles.icon} />
                      <p>
                        <strong>{n.actor.userName}</strong> delte dit indlæg.
                      </p>
                      <Link
                        href={`/entry/${n.entry.id}`}
                        className={styles.naviToEntry}
                        onClick={() => handleNotificationClick(n.id)}
                      >
                        &gt;
                      </Link>
                    </>
                  ) : null}
                </div>
              ))
            )}
          </div>

          <div className={styles.footer}>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className={styles.clearAllButton}
              >
                Ryd alle
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
