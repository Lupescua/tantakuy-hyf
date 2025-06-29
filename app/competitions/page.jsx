import CompetitionList from '../components/competitions/CompetitionList';
import styles from './competitions.module.css';

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

export default function CompetitionsPage() {
  return (
    <>
      <main className={styles.mainContent}>
        <h1>Igangværende Konkurrencer</h1>
        <CompetitionList competitions={competitionsMock} />
      </main>
    </>
  );
}
