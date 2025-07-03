import CompetitionCard from './CompetitionCard';
import styles from './CompetitionList.module.css';

export default function CompetitionList({ competitions }) {
  if (!competitions || !Array.isArray(competitions)) {
    return <p>No competitions found</p>;
  }
  if (loading) return <p>Loading company names...</p>;

  return (
    <div className={styles.list}>
      {competitions.map((competition) => (
        <>
          <div key={competition._id || competition.id}>
            <h1>{competition.title}</h1>
            <p className={styles.companyName}>
              {companyNames[competition.company] || 'Loading company...'}
            </p>
            <CompetitionCard competition={competition} />
          </div>
          <CompetitionCard key={competition._id} competition={competition} />
        </>
      ))}
    </div>
  );
}
