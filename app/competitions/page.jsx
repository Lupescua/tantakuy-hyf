import CompetitionList from '../components/competitions/CompetitionList';
import styles from './competitions.module.css';

export default function CompetitionsPage() {
  return (
    <>
      <main className={styles.mainContent}>
        <h1>Igangværende Konkurrencer</h1>
        <CompetitionList/>
      </main>
    </>
  );
}
