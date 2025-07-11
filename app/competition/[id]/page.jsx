'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import API from '@/utils/axios';

import EntryCard from '@/app/components/entries/EntryCard';
import JoinButton from '@/app/components/competitions/JoinButton';
import Loader from '@/app/components/loader/Loader';

import styles from '../competition.module.css';

const PLACEHOLDER_IMG = 'https://picsum.photos/320/240?grayscale&blur=1';

export default function CompetitionGalleryPage() {
  const { id } = useParams();

  /* ------------------------------------------------------------------
     local state
  ------------------------------------------------------------------ */
  const [competition, setCompetition] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ------------------------------------------------------------------
     fetch competition + its entries in parallel
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (!id) return; // should never happen but guard anyway
    setLoading(true);
    (async () => {
      try {
        const [compRes, entriesRes] = await Promise.all([
          API.get(`/competitions/${id}`),
          API.get('/entries', { params: { competitionId: id } }),
        ]);

        /* back-end contract:
           /competitions/:id   → document or { error }
           /entries?competitionId → [ … ] or { error }                  */
        if (compRes.data?.error) throw new Error(compRes.data.error);
        if (entriesRes.data?.error) throw new Error(entriesRes.data.error);

        setCompetition(compRes.data);
        setEntries(entriesRes.data); // plain array of entry docs
      } catch (err) {
        console.error('Error loading competition:', err);
        setError('Kunne ikke indlæse konkurrencen 😕');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ------------------------------------------------------------------
     render
  ------------------------------------------------------------------ */
  if (loading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!competition) return <p>Konkurrence ikke fundet.</p>;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{competition.title ?? 'Konkurrence'}</h1>

      <div className={styles.grid}>
        {entries.length ? (
          entries.map((entry) => (
            <EntryCard
              key={entry._id}
              image={entry.imageUrl || PLACEHOLDER_IMG}
              entryId={entry._id}
              showVoteCount /* default = true */
            />
          ))
        ) : (
          <p className={styles.noEntries}>Ingen indlæg endnu.</p>
        )}
      </div>

      {/* Join button (handles auth internally) */}
      <JoinButton competitionId={competition._id} />
    </main>
  );
}
