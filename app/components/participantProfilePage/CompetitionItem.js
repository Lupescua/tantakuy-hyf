import styles from './CompetitionItem.module.css';
import Link from 'next/link';
import Image from 'next/image';
export default function CompetitionItem({
  id,
  title,
  organizer,
  likes,
  shares,
  saved,
  imageUrl,
}) {
  return (
    <Link href={`/competition/${id}`} className={styles.competitionItem}>
      <div className={styles.infoLeft}>
        <div className={styles.header}>
          <h4 className={styles.title}>{title}</h4>
          <span className={styles.separator}> - </span>
          <span className={styles.organizer}>{organizer}</span>
        </div>
        <Image
          src={imageUrl}
          alt="Your submission"
          width={93}
          height={57}
          className={styles.userImage}
        />
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
