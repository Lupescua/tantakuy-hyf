'use client';

import { useEffect, useState } from 'react';
import CompetitionList from '../components/competitions/CompetitionList';
import styles from './page.module.css';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const res = await fetch('/api/competitions');
        const data = await res.json();
        setCompetitions(data.data || []);
      } catch (err) {
        console.error('Failed to load competitions:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompetitions();
  }, []);

  return (
    <main className={styles.mainContent}>
      <h1>Igangværende Konkurrencer</h1>
      {loading ? (
        <p>Henter konkurrencer...</p>
      ) : competitions.length > 0 ? (
        <CompetitionList competitions={competitions} />
      ) : (
        <p>Ingen konkurrencer fundet.</p>
      )}
    </main>
  );
}