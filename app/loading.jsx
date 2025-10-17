import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loadingContainer} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true"></div>
      <p className={styles.loadingText}>Indlæser...</p>
    </div>
  );
}
