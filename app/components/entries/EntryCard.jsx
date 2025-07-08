'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from './EntryCard.module.css';
import API from '@/utils/axios';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Loader from '../loader/Loader';

export default function EntryCard({
  image,
  entryId,
  showActions = true,
  showVoteCount = true,
}) {
  const router = useRouter();
  const { user, loading: authLoading, refresh } = useAuth();

  // ▶️ Component state
  const [votes, setVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteRecordId, setVoteRecordId] = useState(null);
  const [loadingVotes, setLoadingVotes] = useState(true);

  // 📥 1) Load total votes + whether current user already voted
  useEffect(() => {
    // only *real* Mongo ObjectIds (24-hex) may call /api/votes/*
    const isRealId =
      typeof entryId === 'string' && /^[0-9a-f]{24}$/i.test(entryId);
    if (!isRealId) {
      setLoadingVotes(false); // placeholder → no spinner
      return; // ⤴ skip fetch
    }
    let isMounted = true;
    async function fetchVoteInfo() {
      setLoadingVotes(true);
      try {
        // GET /api/votes/me?entryId=...
        const { data } = await API.get('/votes/me', { params: { entryId } });
        if (data.success && isMounted) {
          setVotes(data.votes);
          setHasVoted(data.hasVoted);
          setVoteRecordId(data.recordId);
        }
      } catch (err) {
        console.error('Failed to load vote info:', err);
      } finally {
        if (isMounted) setLoadingVotes(false);
      }
    }
    fetchVoteInfo();
    return () => {
      isMounted = false;
    };
  }, [entryId, refresh]);

  // 🔄 2) Toggle vote on/off, or redirect guest to login
  const handleVote = async () => {
    if (authLoading || loadingVotes) return; // guard during loads
    if (!user) {
      router.push('/login'); // guests go to login
      return;
    }

    setLoadingVotes(true);
    try {
      if (!hasVoted) {
        // cast new vote
        const { data } = await API.post('/votes', {
          entry: entryId,
          voteType: 'like',
        });
        if (data.success) {
          setVotes((v) => v + 1);
          setHasVoted(true);
          setVoteRecordId(data.vote._id);
        }
      } else {
        // remove existing vote
        await API.delete(`/votes/${voteRecordId}`);
        setVotes((v) => Math.max(v - 1, 0));
        setHasVoted(false);
        setVoteRecordId(null);
      }
      // refresh(); // update auth context (in case other UIs depend on it)
    } catch (err) {
      /* 409 means we already have a vote → sync UI */
      if (err.response?.status === 409) {
        setHasVoted(true);
      } else {
        console.error('Vote operation failed:', err);
      }
    } finally {
      setLoadingVotes(false);
    }
  };

  /* share → copy URL */
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link kopieret 📋');
    } catch {
      /* no-op */
    }
  };

  return (
    <div className={styles.card}>
      {/* ENTRY IMAGE */}

      {entryId ? (
        /* real entry → click goes to its own page */
        <Link href={`/entry/${entryId ?? ''}`} className={styles.imageContainer}>
          <img src={image} alt="Entry image" className={styles.image} />
        </Link>
      ) : (
        /* placeholder slot → static img, no link */
        <img src={image} alt="Entry image" className={styles.image} />
      )}

      {/* FOOTER: vote count + button */}
      {(showVoteCount || showActions) && (
        <div className={styles.bottom}>
          {showVoteCount && (
            <div className={styles.voteCount}>
              {/* show loader while fetching votes */}
              {loadingVotes ? <Loader /> : `${votes} stemmer`}
            </div>
          )}

          {/* grouped action buttons (vote + share) */}
          {showActions && (
            <div className={styles.buttonGroupWrapper}>
              <button
                onClick={handleVote}
                disabled={authLoading || loadingVotes || !entryId}
                className={`${styles.voteButton} ${hasVoted ? styles.voted : ''}`}
              >
                {hasVoted ? <FaHeart /> : <FaRegHeart />} Stem
              </button>

              {/* share button — only when we also render actions _and_ have a real entry */}
              {entryId && (
                <button onClick={share} className={styles.shareButton}>
                  <img src="/del.png" alt="Del" className={styles.shareIcon} />
                  Del
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
