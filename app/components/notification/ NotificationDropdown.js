import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import API from '@/utils/axios';

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchNotifications = async () => {
      const res = await API.get('/notifications', {
        params: { userId: user._id },
      });
      setNotifications(res.data.notifications || []);
    };

    fetchNotifications();
  }, [user]);

  return (
    <div>
      <h4>Notifications</h4>
      <ul>
        {notifications.map((n) => (
          <li key={n._id}>
            {n.type === 'win'
              ? `🎉 Tillykke! Du har vundet konkurrencen “${n.competitionTitle}”`
              : n.type === 'like'
                ? `${n.actor} synes godt om dit indlæg`
                : `${n.actor} delte dit indlæg`}
          </li>
        ))}
      </ul>
    </div>
  );
}
