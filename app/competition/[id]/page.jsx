'use client';

import { useParams } from 'next/navigation';
import EntryCard from '@/app/components/entries/EntryCard';
import NavbarLoggedIn from '@/app/components/layouts/NavbarLoggedIn/NavbarLoggedIn';
import FooterLoggedIn from '@/app/components/layouts/FooterLoggedIn/FooterLoggedIn';
import styles from '../competition.module.css';
import JoinButton from '@/app/components/competitions/JoinButton';

const competitionsMock = [
  {
    id: '1',
    name: 'Bistad - Efterårshygge',
    logo: '/images/logo1.png',
    images: [
      '/images/entry1.jpg',
      '/images/entry2.jpg',
      '/images/entry3.jpg',
      '/images/entry4.jpg',
      '/images/entry5.jpg',
      '/images/entry6.jpg',
    ],
  },
  {
    id: '2',
    name: 'Konkurrence titel',
    logo: '/images/logo2.png',
    images: ['/images/entry7.jpg', '/images/entry8.jpg', '/images/entry9.jpg'],
  },
];

export default function CompetitionGalleryPage() {
  const { id } = useParams();
  const competition = competitionsMock.find((c) => c.id === id);

  return (
    <>
      <NavbarLoggedIn />
      <main className={styles.main}>
        <h1 className={styles.title}>{competition.name}</h1>
        <div className={styles.grid}>
          {competition.images.map((src, index) => (
            <EntryCard
              key={index}
              image={src}
              entryId={`competition-${id}-img-${index}`}
              showVoteCount={false}
            />
          ))}
        </div>
        <JoinButton/>
      </main>
      <FooterLoggedIn />
    </>
  );
}