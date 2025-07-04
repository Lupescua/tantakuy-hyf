import { mockUser, mockCompetitions } from '../../participant/profile/mockData';
import CompetitionItem from './CompetitionItem';
import styles from './ProfileSection.module.css';

export default function ProfileSection() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>
          {mockUser.firstName} {mockUser.lastName}
        </h2>
        <div className={styles.avatar}>
          {mockUser.firstName[0]}
          {mockUser.lastName[0]}
        </div>
        <p className={styles.region}>{mockUser.region}</p>
      </div>

      <div className={styles.about}>
        <h3>About:</h3>
        <p>{mockUser.about}</p>
      </div>

      <div className={styles.competitions}>
        <h3>Konkurrencer deltaget i</h3>
        <div className={styles.competitionsList}>
          {mockCompetitions.map((item) => (
            <CompetitionItem
              key={item.id}
              title={item.title}
              organizer={item.organizer}
              likes={item.likes}
              shares={item.shares}
              saved={item.saved}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
