'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EntryCard from '@/app/components/entries/EntryCard';
import NavbarLoggedIn from '@/app/components/layouts/NavbarLoggedIn/NavbarLoggedIn';
import FooterLoggedIn from '@/app/components/layouts/FooterLoggedIn/FooterLoggedIn';
import JoinButton from '@/app/components/competitions/JoinButton';
import styles from '../competition.module.css';

export default function CompetitionGalleryPage() {
  const { id } = useParams();
  const [competition, setCompetition] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchCompetitionData() {
      try {
        const [compRes, entriesRes] = await Promise.all([
          fetch(`/api/competitions`),
          fetch(`/api/entries?competitionId=${id}`),
        ]);

        const competitions = await compRes.json();
        const selectedCompetition = competitions.find((c) => c._id === id);

        if (selectedCompetition) {
          setCompetition(selectedCompetition);
        }

        const entriesData = await entriesRes.json();
        setEntries(entriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    }

    fetchCompetitionData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!competition) return <p>Competition not found</p>;

  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>{competition.name}</h1>
        <div className={styles.grid}>
          {entries.map((entry) => (
            <EntryCard
              key={entry._id}
              image={entry.imageUrl}
              entryId={entry._id}
              showVoteCount={false}
              showActions={true}
            />
          ))}
        </div>
        <JoinButton />
        <JoinButton />
      </main>
    </>
  );
}
