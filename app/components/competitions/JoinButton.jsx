import Link from 'next/link';
import styles from '../../competition/competition.module.css';

export default function JoinButton({competitionId}) {
  return (
    <div className={styles.buttonWrapper}>
      <Link href={`/participant-entry/${competitionId}`} className={styles.joinButton}>
        DELTAG HER 
      </Link>
    </div>
  );
}
