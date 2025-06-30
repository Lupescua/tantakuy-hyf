import CompetitionCard from './CompetitionCard';
import styles from './CompetitionList.module.css';

export default function CompetitionList({ competitions }) {
  return (
    <div className={styles.list}>
      {competitions.map((competition) => (
        <CompetitionCard key={competition._id} competition={competition} />
      ))}
    </div>
  );
}
