import Link from 'next/link';
import styles from '../../competition/competition.module.css';

export default function JoinButton() {
  return (
    <div className={styles.buttonWrapper}>
      <Link href="/login" className={styles.joinButton}>
      DELTAG HER
    </Link>
    </div>
    
  );
}