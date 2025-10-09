import styles from './loading.module.css';

export default function CompetitionLoading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.skeleton}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonGrid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonText}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
