'use client';

import styles from './CompanyCompetitionItem.module.css';
import { FaEdit, FaTrash, FaPause } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import API from '@/utils/axios';

export default function CompanyCompetitionItem({
  id,
  title,
  createdAt,
  startDate,
  endDate,
  onDelete,
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this competition?')) return;
    try {
      await API.delete(`/competitions/${id}`);
      router.refresh();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className={styles.competitionItem}>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.date}>
          Oprettet: {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>
      <div className={styles.actions}>
        <button className={`${styles.button} ${styles.editBtn}`}>
          <FaEdit style={{ marginRight: '6px' }} />
          Rediger
        </button>
        <button
          className={`${styles.button} ${styles.deleteBtn}`}
          onClick={() => onDelete(id)}
        >
          <FaTrash style={{ marginRight: '6px' }} />
          Slet
        </button>
        <button className={`${styles.button} ${styles.suspendBtn}`}>
          <FaPause style={{ marginRight: '6px' }} />
          Suspendér
        </button>
      </div>
    </div>
  );
}
