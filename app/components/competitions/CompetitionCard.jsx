// app/components/competitions/CompetitionCard.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import API from '@/utils/axios';
import styles from './CompetitionCard.module.css';
import EntryCard from '../entries/EntryCard';
import CompetitionDetailsModal from '../modals/CompetitionDetailsModal';

const PLACEHOLDER_IMG = 'https://picsum.photos/320/240?grayscale&blur=1';

export default function CompetitionCard({ competition }) {
  const { _id, title, logo } = competition;
  const [entryImages, setEntryImages] = useState([]);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await API.get('/entries', {
          params: { competitionId: _id },
        });
        // if route returns { error: "..."} on 4xx/5xx, you'll now see it:
        if (res.data.error) throw new Error(res.data.error);

        const images = res.data.map((e) => e.imageUrl || PLACEHOLDER_IMG);

        while (images.length < 6) images.push(PLACEHOLDER_IMG);
        images.length = 6;

        setEntryImages(images);
      } catch (err) {
        console.error(
          'Error fetching entry images:',
          err.response?.data || err.message,
        );
        setEntryImages(Array(6).fill(PLACEHOLDER_IMG));
      }
    }
    fetchEntries();
  }, [_id]);

  return (
    <div className={styles.card}>
      <Link href={`/competition/${_id}`} className={styles.header}>
        <div className={styles.logoWrapper}>
          <img
            src={logo || PLACEHOLDER_IMG}
            alt={`${title} logo`}
            className={styles.logo}
          />
        </div>
        <h2 className={styles.title}>{title}</h2>
      </Link>

      <CompetitionDetailsModal competitionId={_id} />

      <div className={styles.grid}>
        {entryImages.map((src, i) => (
          <EntryCard
            key={i}
            image={src}
            entryId={`competition-${_id}-img-${i}`}
            showActions={false}
            showVoteCount={false}
            showActions={false}
          />
        ))}
      </div>
    </div>
  );
}
