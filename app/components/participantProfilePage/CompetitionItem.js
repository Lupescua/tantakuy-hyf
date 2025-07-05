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
      <h4>{title}</h4>
      <p className={styles.organizer}>{organizer}</p>
      <div className={styles.stats}>
        <span>{likes}</span>
        {shares && <span>↗{shares}</span>}
        <span>{saved}</span>
      </div>
    </Link>
  );
}