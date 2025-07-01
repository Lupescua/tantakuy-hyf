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

  useEffect(() => {
    const storedVote = localStorage.getItem(`voted-${entryId}`);
    const storedCount = localStorage.getItem(`votes-${entryId}`);
    if (storedVote === 'true') {
      setVoted(true);
    }
    if (storedCount) {
      setVotes(parseInt(storedCount));
    }
  }, [entryId]);

  const handleVote = () => {
    if (!voted) {
      const newVotes = votes + 1;
      setVotes(newVotes);
      setVoted(true);
      localStorage.setItem(`voted-${entryId}`, 'true');
      localStorage.setItem(`votes-${entryId}`, newVotes);
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
              disabled={voted}
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
