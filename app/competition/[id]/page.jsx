'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import API from '@/utils/axios';
import EntryCard from '@/app/components/entries/EntryCard';
import JoinButton from '@/app/components/competitions/JoinButton';
import Loader from '@/app/components/loader/Loader';
import styles from '../competition.module.css';

const PLACEHOLDER_IMG = 'https://picsum.photos/320/240?grayscale&blur=1';

export default function CompetitionGalleryPage() {
  const { id } = useParams();
  const [entries, setEntries] = useState([]);
  const [competitionName, setCompetitionName] = useState('Konkurrence');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [entriesRes, compRes] = await Promise.all([
          API.get('/entries', { params: { competitionId: id } }),
          API.get(`/competitions/${id}`),
        ]);

        // Check for backend errors:
        if (entriesRes.data.error) throw new Error(entriesRes.data.error);
        if (compRes.data.error) throw new Error(compRes.data.error);

        setEntries(entriesRes.data);
        const title = compRes.data.title || compRes.data.name;
        if (title) setCompetitionName(title);
      } catch (err) {
        console.error(
          'Error loading competition data:',
          err.response?.data || err.message,
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <Loader />;

  useEffect(() => {
    async function fetchCompetition() {
      try {
        const [compRes, entriesRes] = await Promise.all([
          API.get(`/competitions/${id}`),
          API.get(`/entries/by-competition/${id}`),
        ]);
        setCompetition({
          ...compRes.data,
          images: entriesRes.data.data.map((entry) => entry.imageUrl),
        });
      } catch (error) {
        console.error('Failed to fetch competition:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompetition();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!competition) return <div>Competition not found</div>;
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{competitionName}</h1>
      <div className={styles.grid}>
        {entries.length > 0 ? (
          entries.map((entry) => (
            <EntryCard
              key={entry._id}
              image={entry.imageUrl || PLACEHOLDER_IMG}
              entryId={entry._id}
              showVoteCount={true}
            />
          ))
        ) : (
          <p className={styles.noEntries}>Ingen bidrag endnu.</p>
        )}
      </div>
      <JoinButton />
    </main>
  );
}
