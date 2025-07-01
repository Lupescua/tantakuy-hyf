import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './CompetitionCard.module.css';
import EntryCard from '../entries/EntryCard';

const PLACEHOLDER_IMG = '/default-image.png';

export default function CompetitionCard({ competition }) {
  const { _id, name, logo } = competition;
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch(`/api/entries?competitionId=${_id}`);
        const data = await res.json();
        const imageUrls = data.slice(0, 6).map((entry) => entry.imageUrl);

        while (imageUrls.length < 6) {
          imageUrls.push(PLACEHOLDER_IMG);
        }

        setImages(imageUrls);
      } catch (err) {
        console.error(`Failed to load entries for competition ${_id}`, err);
        setImages(Array(6).fill(PLACEHOLDER_IMG));
      }
    }

    fetchEntries();
  }, [_id]);

  return (
    <div className={styles.card}>
      <Link href={`/competition/${_id}`} className={styles.header}>
        <div className={styles.logoWrapper}>
          <img src={logo} alt={`${name} logo`} className={styles.logo} />
        </div>
        <h2 className={styles.title}>{name}</h2>
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
