'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import API from '@/utils/axios';

import EntryCard from '@/app/components/entries/EntryCard';
import JoinButton from '@/app/components/competitions/JoinButton';
import Loader from '@/app/components/loader/Loader';

import styles from '../competition.module.css';

const PLACEHOLDER_IMG = 'https://picsum.photos/320/240?grayscale&blur=1';
const ENTRIES_PER_PAGE = 8;

export default function CompetitionGalleryPage() {
  const { id } = useParams();

  /* ------------------------------------------------------------------
     local state
  ------------------------------------------------------------------ */
  const [competition, setCompetition] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 750);
    };
    checkScreenSize(); // run on mount
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

        /* interceptor unwraps responses:
           /competitions/:id   → { competition: {...} }
           /entries?competitionId → array of entries */
        setCompetition(compRes.data.competition || compRes.data);
        setEntries(Array.isArray(entriesRes.data) ? entriesRes.data : []);
      } catch (err) {
        console.error('Error loading competition:', err);
        setError('Kunne ikke indlæse konkurrencen 😕');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);
  const entriesPerPage = isSmallScreen ? 4 : 6;
  const totalPages = Math.ceil(entries.length / entriesPerPage);
  const paginatedEntries = entries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  );
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
        {paginatedEntries.length ? (
          paginatedEntries.map((entry) => (
            <EntryCard
              key={entry._id}
              image={entry.imageUrl || PLACEHOLDER_IMG}
              entryId={entry._id}
              showVoteCount /* default = true */
            />
          ))
        ) : (
          <p className={styles.noEntries}>Ingen bidrag endnu.</p>
        )}
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`${styles.pageButton} ${currentPage === i + 1 ? styles.active : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
      {/* Join button (handles auth internally) */}
      <JoinButton competitionId={competition._id} />
      <div className={styles.empty}></div>{' '}
    </main>
  );
}
