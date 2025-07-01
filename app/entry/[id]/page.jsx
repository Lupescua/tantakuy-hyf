'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaHeart, FaRegHeart, FaShareAlt } from 'react-icons/fa';
import API from '@/utils/axios';
import Loader from '@/app/components/loader/Loader';
import { useAuth } from '@/context/AuthContext';
import styles from '../entryPage.module.css';

const PLACEHOLDER_IMG = 'https://picsum.photos/600/400?grayscale&blur=1';

export default function EntryPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [entry, setEntry] = useState(null);
  const [votes, setVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteRecId, setVoteRecId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  /* ------------- 1. load entry + vote info ---------------- */
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // entry doc
        const { data: e } = await API.get(`/entries/${id}`);
        // votes + my vote
        const { data: v } = await API.get('/votes/me', {
          params: { entryId: id },
        });

        setEntry(e);
        if (v.success) {
          setVotes(v.votes);
          setHasVoted(v.hasVoted);
          setVoteRecId(v.recordId);
        }
      } catch (err) {
        console.error('Failed to load entry page:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  /* ------------- 2. toggle vote --------------------------- */
  const toggleVote = async () => {
    if (authLoading || voting) return;

    if (!user) {
      // not logged-in → redirect to /login
      window.location.href = '/login';
      return;
    }

    setVoting(true);
    try {
      if (!hasVoted) {
        // add like
        const { data } = await API.post('/votes', {
          entry: id,
          voteType: 'like',
        });
        if (data.success) {
          setVotes((v) => v + 1);
          setHasVoted(true);
          setVoteRecId(data.vote._id);
        }
      } else {
        // remove like
        await API.delete(`/votes/${voteRecId}`);
        setVotes((v) => Math.max(v - 1, 0));
        setHasVoted(false);
        setVoteRecId(null);
      }
    } catch (err) {
      console.error('Vote error:', err);
    } finally {
      setVoting(false);
    }
  };

  /* ------------- 3. share (simple clipboard copy) --------- */
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard 📋');
    } catch {
      alert('Could not copy link');
    }
  };

  /* ------------- UI -------------------------------------- */
  if (loading) return <Loader />;

  return (
    <main className={styles.main}>
      {/* headline: participant name · optional caption */}
      <h1 className={styles.title}>
        {entry.participant?.userName ?? 'Ukendt deltager'}
        {entry.caption && ` · ${entry.caption}`}
      </h1>

      <img
        className={styles.image}
        src={entry.imageUrl || PLACEHOLDER_IMG}
        alt="Entry"
      />

      {/* vote counter + buttons */}
      <div className={styles.actions}>
        <button
          onClick={toggleVote}
          disabled={authLoading || voting}
          className={`${styles.voteBtn} ${hasVoted ? styles.voted : ''}`}
        >
          {hasVoted ? <FaHeart /> : <FaRegHeart />} {votes}
        </button>

        <button onClick={share} className={styles.shareBtn}>
          <FaShareAlt /> Del
        </button>
      </div>
    </main>
  );
}
