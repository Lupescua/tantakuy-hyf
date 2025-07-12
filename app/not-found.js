import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <h2 className={styles.subtitle}>Siden blev ikke fundet</h2>
      <p className={styles.description}>
        Beklager, siden du leder efter eksisterer ikke eller er blevet flyttet.
      </p>
      <Link href="/" className={styles.backButton}>
        Tilbage til forsiden
      </Link>
    </main>
  );
}
