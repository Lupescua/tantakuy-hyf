'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './EntryPage.module.css';

export default function EntryPage() {
  const { id } = useParams();
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch(`/api/entries?competitionId=${id}`);
        const data = await res.json();

        if (res.ok) {
          setEntries(data);
        } else {
          setError(data.error || 'Error fetching entries');
        }
      } catch (error) {
        setError('Failed to fetch entries');
      }
    }

    if (id) fetchEntries();
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (entries.length === 0) return <p>Loading...</p>;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>TANTAKUY</div>
      </header>

      <h1 className={styles.title}>Entries for Competition {id}</h1>

      {entries.map((entry, index) => (
        <div key={entry._id || index} className={styles.entry}>
          <h2>{entry.caption}</h2>
          <p>{entry.description}</p>

          <div className={styles.imageWrapper}>
            <img src={entry.imageUrl} alt="Entry Image" className={styles.image} />
            <span className={styles.votes}>{entry.votes} stemmer</span>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.vote}
              onClick={async () => {
                try {
                  const res = await fetch(`/api/entries/${entry._id}`, {
                    method: 'PATCH',
                  });

                  if (!res.ok) throw new Error('Vote failed');

                  const updatedEntry = await res.json();

                  setEntries((prev) =>
                    prev.map((e) => (e._id === entry._id ? updatedEntry : e))
                  );
                } catch (err) {
                  console.error(err);
                  alert('Error al votar');
                }
              }}
            >
              ❤️ Stem
            </button>

            <button className={styles.share}>📤 Del</button>
          </div>

          <p className={styles.entryId}>Entry ID: {entry._id}</p>
        </div>
      ))}
    </main>
  );
}
