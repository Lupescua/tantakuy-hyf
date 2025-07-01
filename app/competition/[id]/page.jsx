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

  useEffect(()=> {
    async function fetchCompetition(){
      try {
        const data = await API.get(id)
        setCompetition(data)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompetition();
  },[id])
  if (loading) return <div>Loading...</div>;
  if (!competition) return <div>Competition not found</div>;
  return (
    <>
      <main className={styles.main}>
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
        <JoinButton />
      </main>
    </>
  );
}
