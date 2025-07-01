import CompetitionCard from './CompetitionCard';
import styles from './CompetitionList.module.css';

export default function CompetitionList({ competitions }) {
  if (!competitions || !Array.isArray(competitions)) {
    return <p>No competitions found</p>;
  }

  return (
    <div className={styles.list}>
      {competitions.map((competition) => (
        <div><h1>{competition.title}</h1>
        <CompetitionCard key={competition._id || competition.id} competition={competition} />
        </div>
      ))}
    </div>
  );ç
}
