import styles from './CompetitionItem.module.css';
import Link from 'next/link';

export default function CompetitionItem({
  id,
  title,
  organizer,
  likes,
  shares,
  saved,
}) {
  return (
    <Link href={`/competition/${id}`} className={styles.competitionItem}>
      <div className={styles.infoLeft}>
        <h4 className={styles.title}>{title}</h4>
        <span className={styles.organizer}>{organizer}</span>
      </div>
      <div className={styles.stats}>
        <span className={`${styles.statItem} ${styles.like}`}>
          {likes} Likes
        </span>
        {shares !== undefined && (
          <span className={`${styles.statItem} ${styles.share}`}>
            {shares} Shares
          </span>
        )}
        <span className={`${styles.statItem} ${styles.save}`}>
          {saved} Saved
        </span>
      </div>
    </Link>
  );
}
