'use client';

import styles from './CompanyCompetitionItem.module.css';
import { FaEdit, FaTrash, FaPause } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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

  // State for stats
  const [stats, setStats] = useState({
    participants: 0,
    votes: 0,
    shares: 0,
    clicks: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Load stats on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      setLoadingStats(true);
      try {
        const res = await API.get(`/competitions/${id}/stats`);
        if (isMounted && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    }
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [id]);

  //helper for formattin the date object.
  function formatDate(value) {
    // 1) If it’s already a Date instance, use it directly
    let dateObj;
    if (value instanceof Date) {
      dateObj = value;
    } else if (typeof value === 'string') {
      // 2) Normalize "+HH:MM" or "-HH:MM" to "Z"
      const normalized = value.replace(/([+-]\d{2}):(\d{2})$/, 'Z');
      dateObj = new Date(normalized);
    } else {
      // 3) Fallback: try to coerce whatever it is
      dateObj = new Date(value);
    }

    // 4) If still invalid, show a placeholder
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date:', value);
      return '—';
    }
    return dateObj.toLocaleDateString();
  }

  //Delete a competition
  const handleDelete = async () => {
    if (!confirm('Er du sikker på, at du vil slette denne konkurrence?')) return;
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
        <div className={styles.date}>Oprettet: {formatDate(createdAt)}</div>
        <div className={styles.date}>Starter på: {formatDate(startDate)}</div>
        <div className={styles.date}>Deadline: {formatDate(endDate)}</div>

        {!loadingStats && (
          <div className={styles.stats}>
            <span>Deltagere: {stats.participants}</span>
            <span>Stemmer: {stats.votes}</span>
            <span>Delinger: {stats.shares}</span>
            <span>Klik: {stats.clicks}</span>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button className={`${styles.button} ${styles.editBtn}`}>
          Rediger
        </button>
        <button
          className={`${styles.button} ${styles.deleteBtn}`}
          onClick={handleDelete}
        >
          Slet
        </button>
        <button className={`${styles.button} ${styles.suspendBtn}`}>
          Suspendér
        </button>
      </div>
    </div>
  );
}
