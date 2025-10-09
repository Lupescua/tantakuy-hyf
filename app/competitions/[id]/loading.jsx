import styles from './loading.module.css';

const SKELETON_CARD_COUNT = 6;

export default function CompetitionLoading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.skeleton}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonGrid}>
          {[...Array(SKELETON_CARD_COUNT)].map((_, i) => (
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
