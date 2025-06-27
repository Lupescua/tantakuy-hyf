'use client'
import { useState } from 'react';
import Link from 'next/link';
import styles from './CompetitionCard.module.css';
import EntryCard from '../entries/EntryCard';
import CompetitionDetailsModal from '../modals/CompetitionDetailsModal';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/150';

export default function CompetitionCard({ competition }) {
  const [selectedId, setSelectedId] = useState(null);
  const { id, name, logo, images } = competition;

  const displayedImages = [...images];
  while (displayedImages.length < 6) {
    displayedImages.push(PLACEHOLDER_IMG);
  }
  displayedImages.length = 6;

  return (
    <div className={styles.card}>
      <Link href={`/competition/${id}`} className={styles.header}>
        <div className={styles.logoWrapper}>
          <img src={logo} alt={`${name} logo`} className={styles.logo} />
        </div>
        <h2 className={styles.title}>{name}</h2>
      </Link>
       <button onClick={() => setSelectedId(id)} className={styles.detailsButton}>
        Om
      </button>

        {selectedId && (
          <CompetitionDetailsModal
            competitionId={selectedId}
            onClose={() => setSelectedId(null)}
          />
        )}
      <div className={styles.grid}>
        {displayedImages.map((src, i) => (
          <EntryCard
            key={i}
            image={src}
            entryId={`competition-${id}-img-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
