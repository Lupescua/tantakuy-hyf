import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './CompetitionCard.module.css';
import EntryCard from '../entries/EntryCard';

const PLACEHOLDER_IMG = '/default-image.png';

export default function CompetitionCard({ competition }) {
  const { title, logo, images } = competition;
  const id = competition._id;
  const displayedImages = [images];
  while (displayedImages.length < 6) {
    displayedImages.push(PLACEHOLDER_IMG);
  }
  displayedImages.length = 6;

  return (
    <div className={styles.card}>
      <Link href={`/competition/${id}`} className={styles.header}>
        <div className={styles.logoWrapper}>
          <img src={logo} alt={`${title} logo`} className={styles.logo} />
        </div>
        {/* <h2 className={styles.title}>{title}</h2> */}
      </Link>

      <div className={styles.grid}>
        {images.map((src, i) => (
          <EntryCard
            key={i}
            image={src}
            showVoteCount={false}
            showActions={false}
          />
        ))}
      </div>
    </div>
  );
}
