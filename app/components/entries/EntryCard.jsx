'use client';

import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from './EntryCard.module.css';

export default function EntryCard({
  image,
  initialVotes = 0,
  entryId,
  showVoteCount = true,
  showActions = true,
}) {
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(initialVotes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVotes() {
      try {
        const res = await fetch(`/api/votes?entryId=${entryId}`);
        const data = await res.json();
        if (data.success) {
          setVotes(data.votes);
        }
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    }

    const localVote = localStorage.getItem(`voted-${entryId}`);
    if (localVote === 'true') {
      setVoted(true);
    }

    fetchVotes();
  }, [entryId]);

  const handleVote = async () => {
    if (voted || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        body: JSON.stringify({ entry: entryId, voteType: 'like' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.status === 401) {
        alert('login required');
        return;
      }

      if (data.success) {
        setVotes((prev) => prev + 1);
        setVoted(true);
        localStorage.setItem(`voted-${entryId}`, 'true');
      } else {
        alert(data.message || 'coundnt vote.');
      }
    } catch (error) {
      console.error(error);
      alert('something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <img src={image} alt="entry" className={styles.image} />

      <div className={styles.bottom}>
        {showVoteCount && (
          <div className={styles.voteCount}>{votes} stemmer</div>
        )}
        {showActions && (
          <div className={styles.buttonGroupWrapper}>
            <button
              onClick={handleVote}
              disabled={voted || loading}
              className={`${styles.voteButton} ${voted ? styles.voted : ''}`}
            >
              {voted ? <FaHeart /> : <FaRegHeart />} Stem
            </button>

            <button className={styles.shareButton}>
              <img src="/del.png" alt="Del" className={styles.shareIcon} />
              Del
            </button>
          </div>
        )}
      </div>
    </div>
  );
}