import Link from 'next/link';
import styles from './CompetitionCard.module.css';
import EntryCard from '../entries/EntryCard';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/150';

export default function CompetitionCard({ competition }) {
  const { id, name, logo, images } = competition;

  const displayedImages = [images];
  while (displayedImages.length < 6) {
    displayedImages.push(PLACEHOLDER_IMG);
  }
  displayedImages.length = 6;

  return (
    <div className={styles.card}>
      <Link href={`/competitions/${id}`} className={styles.header}>
        <div className={styles.logoWrapper}>
          <img src={logo} alt={`${name} logo`} className={styles.logo} />
        </div>
        <h2 className={styles.title}>{name}</h2>
      </Link>

      <div className={styles.grid}>
        {displayedImages.map((src, i) => (
          <EntryCard
            key={i}
            image={src}
            entryId={`competitions-${id}-img-${i}`}
            showActions={false}
            showVoteCount={false}
          />
        ))}
      </div>
    </div>
  );
}
