'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import API from '@/utils/axios';
import styles from './CompetitionCard.module.css';
import EntryCard from '../entries/EntryCard';
import CompetitionDetailsModal from '../modals/CompetitionDetailsModal';

const PLACEHOLDER_IMG = 'https://picsum.photos/320/240?grayscale&blur=1';

/**
 * @param {Object}  competition  the competition document
 * @param {Boolean} [showActions=true]    show vote / share buttons?
 * @param {Boolean} [showVoteCount=true]  show vote counter?
 */

export default function CompetitionCard({
  competition,
  showActions = true,
  showVoteCount = true,
}) {
  const { _id, title, logo } = competition;

  /** We keep an **array of objects** so we can preserve
   *  real Mongo IDs _and_ mark placeholders with `id:null`
   *  → `EntryCard` can now decide to skip vote-logic for null IDs.
   **/
  const [slots, setSlots] = useState(
    Array(6).fill({ id: null, src: PLACEHOLDER_IMG }),
  );

  /* ───────────────── fetch first six entries ───────────────── */
  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await API.get('/entries', {
          params: { competitionId: _id },
        });

        // transform → [{ id, src }, …]
        const fetched = res.data.map((e) => ({
          id: e._id,
          src: e.imageUrl || PLACEHOLDER_IMG,
        }));

        // fill / trim to exactly six slots
        while (fetched.length < 6)
          fetched.push({ id: null, src: PLACEHOLDER_IMG });
        fetched.length = 6;

        setSlots(fetched);
      } catch (err) {
        console.error(
          'Error fetching entry images:',
          err.response?.data || err.message,
        );
        // fall back to all placeholders
        setSlots(Array(6).fill({ id: null, src: PLACEHOLDER_IMG }));
      }
    }
    fetchEntries();
  }, [_id]);

  return (
    <div className={styles.card}>
      {/* clicking the header navigates to the gallery page */}
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

      {/* “Om”-modal trigger */}
      <CompetitionDetailsModal competitionId={_id} />

      {/* six EntryCards — placeholders have id === null */}
      <div className={styles.grid}>
        {slots.map(({ id, src }, idx) => (
          <EntryCard
            key={id ?? `ph-${idx}`}
            image={src}
            entryId={
              id
            } /* null → placeholder, EntryCard will skip vote logic   */
            /* show action and counts only whe: the caller allows them and this card is not a placeholder */
            showActions={showActions && Boolean(id)}
            showVoteCount={showVoteCount && Boolean(id)}
          />
        ))}
      </div>
    </div>
  );
}
