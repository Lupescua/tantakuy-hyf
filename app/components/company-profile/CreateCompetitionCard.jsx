import Link from 'next/link';
import styles from './CompanyCompetitionsPage.module.css';

export default function CreateCompetitionCard({ companyId }) {
  return (
    <Link
      href={`/company/${companyId}/competitions/create`}
      className={styles.createCard}
    >
      <div className={styles.plusCircle}>+</div>
    </Link>
  );
}
