'use client';

import { useEffect, useState } from 'react';
import API from '@/utils/axios';
import CompetitionList from '../components/competitions/CompetitionList';
import Loader from '../components/loader/Loader';
import styles from './page.module.css';

/**
 * Competitions overview
 * ─────────────────────
 * 1. fetch /api/competitions once on mount
 * 2. show loader / error states
 * 3. pass the data down to <CompetitionList/>
 */
export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ───────── fetch competitions ───────── */
  useEffect(() => {
    let alive = true; // ignore late answers on unmount
    async function load() {
      try {
        const { data } = await API.get('/competitions');
        if (alive) setCompetitions(data.data || []);
      } catch (err) {
        console.error('Failed to load competitions:', err);
        if (alive) setError('Kunne ikke hente konkurrencer.');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, []);

  /* ───────── UI states ───────── */
  if (loading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.mainContent}>
      <h1>Igangværende Konkurrencer</h1>
      <CompetitionList competitions={competitions} />
    </main>
  );
}
