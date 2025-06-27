'use client'
import styles from '../../competition-gallery/competition-gallery.module.css';
import { useState } from 'react';

export default function ImageCard({ entryId, imageUrl }) {
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState(null);

  const handleLike = async () => {
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry: entryId,
          voteType: "like",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setLiked(true);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Error liking image:", err);
      setError("Something went wrong");
    }
  };

  return (
   <div className={styles.card}>
      <img src={imageUrl} alt="Entry" className={styles.image} />

      <div className={styles.overlay}>
        <div className={styles.buttonGroup}>
          <button onClick={handleLike} className={styles.button}>
            <span className={styles.icon}>{liked ? '❤️' : '🤍'}</span>
            <span>Stem</span>
          </button>
          <button className={styles.button}>
            <span className={styles.icon}><img src="del.png" alt="" className={styles.shareImg}/></span>
            <span>Del</span>
          </button>
        </div>
      </div>
    </div>
  );
}