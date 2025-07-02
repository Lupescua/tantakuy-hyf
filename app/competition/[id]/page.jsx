'use client';

import { useParams } from 'next/navigation';
import EntryCard from '@/app/components/entries/EntryCard';
import styles from '../competition.module.css';
import JoinButton from '@/app/components/competitions/JoinButton';
import { useState, useEffect } from 'react';
import API from '@/utils/axios';


export default function CompetitionGalleryPage() {
  const { id } = useParams();
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetition() {
      try {
        const [compRes, entriesRes] = await Promise.all([
          API.get(`/competitions/${id}`),
          API.get(`/entries/by-competition/${id}`)
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
    <>
      <div className={styles.main}>
        <h1 className={styles.title}>{competition.name}</h1>
        <div className={styles.grid}>
          {competition.images?.map((src, index) => (
            <EntryCard
              key={index}
              image={src}
              entryId={`competition-${id}-img-${index}`}
              showVoteCount={false}
            />
          ))}
        </div>
        <JoinButton competitionId = {competition._id} />
      </div>
    </>
  );
}
