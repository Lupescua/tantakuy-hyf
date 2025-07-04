import styles from './NotificationPanel.module.css';

export default function NotificationsPanel() {
  return (
    <div className={styles.panel}>
      <h3>Notifications</h3>
      <div className={styles.notification}>
        <div className={styles.dot}></div>
        <p>Lorem ipsum dolor sit amet...</p>
        <button>Open</button>
      </div>
    </div>
  );
}
