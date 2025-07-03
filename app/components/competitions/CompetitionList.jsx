'use client';


import { useEffect, useState } from 'react';
import CompetitionCard from './CompetitionCard';
import Loader from '../loader/Loader';
import styles from './CompetitionList.module.css';
import API from '@/utils/axios';

export default function CompetitionList() {
  const [competitions, setCompetitions] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const res = await API.get('/competitions');
        setCompetitions(res.data);
      } catch (err) {
        console.error('Error fetching competitions:', err);
        setError('Could not load competitions.');
      } finally {
        setLoading(false);
      }
    }
    fetchCompetitions();
  }, []);

  if (loading) return <Loader />;
  if (error)   return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.list}>
      {competitions.map((competition) => (
        <CompetitionCard
          key={competition._id}
          competition={competition}
          showActions={false}     // ← hide vote/share buttons
          showVoteCount={false}   // ← hide vote counts
        />
      ))}
    </div>
  );
}
