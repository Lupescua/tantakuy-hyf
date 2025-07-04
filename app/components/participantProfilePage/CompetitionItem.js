import styles from './CompetitionItem.module.css';
export default function CompetitionItem({
  title,
  organizer,
  likes,
  shares,
  saved,
}) {
  return (
    <div className={styles.competitionItem}>
      <h4>{title}</h4>
      <p className={styles.organizer}>{organizer}</p>
      <div className={styles.stats}>
        <span>{likes}</span>
        {shares && <span>↗{shares}</span>}
        <span> {saved}</span>
      </div>
    </div>
  );
}
