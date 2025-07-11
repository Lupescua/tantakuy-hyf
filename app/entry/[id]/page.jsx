'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaHeart, FaRegHeart, FaShareAlt } from 'react-icons/fa';
import API from '@/utils/axios';
import Loader from '@/app/components/loader/Loader';
import { useAuth } from '@/context/AuthContext';
import styles from '../entryPage.module.css';
import { DEFAULT_AVATAR, PLACEHOLDER_IMG } from '@/utils/constants';

export default function EntryPage() {
  const { id } = useParams(); //  clicked entry ID
  const { user, loading: authLoading } = useAuth();

  // feed state + pagination
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  // per-entry maps for loading & vote state
  const [votingMap, setVotingMap] = useState({});
  const [votedMap, setVotedMap] = useState({});
  const [votesMap, setVotesMap] = useState({});
  const [recordIdMap, setRecordIdMap] = useState({});

  /* ------------- 1. load entry + feed page 0 ---------------- */
  useEffect(() => {
    async function loadFeed() {
      setLoading(true);
      try {
        // 1) fetch the clicked entry
        const { data: clicked } = await API.get(`/entries/${id}`);
        // 1a) record a competition click
        API.patch(`/competitions/${clicked.competition}`).catch(console.error);
        // 2) pull competition ID off it
        const compId = clicked.competition;
        // 3) fetch first 20 trending in same comp
        const { data: listRes } = await API.get(
          `/entries/by-competition/${compId}`,
          { params: { limit: 20, skip: 0, sort: 'trending' } },
        );
        const all = Array.isArray(listRes.data) ? listRes.data : [];
        // 4) filter out the clicked one
        const rest = all.filter((e) => e._id !== id);
        // 5) build and set the feed
        const initial = [clicked, ...rest];
        setFeed(initial);

        // initialize vote maps
        const voting = {},
          voted = {},
          votes = {},
          records = {};
        await Promise.all(
          initial.map(async (e) => {
            const { data: v } = await API.get('/votes/me', {
              params: { entryId: e._id },
            });
            voting[e._id] = false;
            if (v.success) {
              voted[e._id] = v.hasVoted;
              votes[e._id] = v.votes;
              records[e._id] = v.recordId; // ← store record ID
            } else {
              voted[e._id] = false;
              votes[e._id] = e.votes || 0;
              records[e._id] = null;
            }
          }),
        );
        setVotingMap(voting);
        setVotedMap(voted);
        setVotesMap(votes);
        setRecordIdMap(records);

        // prep next page
        setPage(1);
        setHasMore(all.length === 20);
      } catch (err) {
        console.error('Failed to load feed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, [id]);

  /* ------------- 2. toggle vote --------------------------- */
  const toggleVote = async (entryId) => {
    if (authLoading || votingMap[entryId]) return;
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setVotingMap((m) => ({ ...m, [entryId]: true }));
    try {
      if (!votedMap[entryId]) {
        // cast new vote
        const { data } = await API.post('/votes', {
          entry: entryId,
          voteType: 'like',
        });
        if (data.success) {
          setVotedMap((m) => ({ ...m, [entryId]: true }));
          setVotesMap((m) => ({ ...m, [entryId]: m[entryId] + 1 }));
          // also store the new recordId so we can delete it next time
          setRecordIdMap((m) => ({ ...m, [entryId]: data.vote._id }));
        }
      } else {
        // remove existing vote
        const recordId = recordIdMap[entryId]; // ← grab the right one
        await API.delete(`/votes/${recordId}`);
        setVotedMap((m) => ({ ...m, [entryId]: false }));
        setVotesMap((m) => ({ ...m, [entryId]: Math.max(m[entryId] - 1, 0) }));
        // clear it out
        setRecordIdMap((m) => ({ ...m, [entryId]: null }));
      }
    } catch (err) {
      console.error('Vote error:', err);
    } finally {
      setVotingMap((m) => ({ ...m, [entryId]: false }));
    }
  };

  /* ------------- 3. share (increment shares + copy link) --- */
  const shareEntry = async (entryId) => {
    const url = `${window.location.origin}/entry/${entryId}`;
    try {
      // 1) Tell the server: increment `shares` on that entry
      await API.patch(`/entries/${entryId}`);

      // 2) Copy the URL to the clipboard
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard 📋');
    } catch (err) {
      console.error('Share failed:', err);
      // Even if the PATCH fails, still try to copy
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard 📋');
      } catch {
        alert('Could not copy link');
      }
    }
  };

  /* ------------- 4. Load more handler --------- */
  const loadMore = async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      // competition lives on feed[0].competition
      const compId = feed[0].competition;
      const skip = page * 20;
      const { data: listRes } = await API.get(
        `/entries/by-competition/${compId}`,
        { params: { limit: 20, skip, sort: 'trending' } },
      );
      const next = Array.isArray(listRes.data) ? listRes.data : [];
      // append
      setFeed((f) => [...f, ...next]);
      // init vote maps for new items
      setVotingMap((m) => {
        const copy = { ...m };
        next.forEach((e) => {
          copy[e._1d] = false;
        });
        return copy;
      });
      setVotedMap((m) => {
        const copy = { ...m };
        next.forEach((e) => {
          copy[e._id] = false;
        });
        return copy;
      });
      setVotesMap((m) => {
        const copy = { ...m };
        next.forEach((e) => {
          copy[e._id] = e.votes || 0;
        });
        return copy;
      });
      setPage((p) => p + 1);
      setHasMore(next.length === 20);
    } catch (err) {
      console.error('Load more failed:', err);
    } finally {
      setLoading(false);
    }
  };

  /* ------------- UI -------------------------------------- */
  if (loading) return <Loader />;

  return (
    <main className={styles.main}>
      {feed.map((entryDoc) => (
        <section key={entryDoc._id} className={styles.entryWrapper}>
          {/* ── 1. username & avatar ── */}
          <div className={styles.header}>
            <img
              src={entryDoc.participant?.avatarUrl || DEFAULT_AVATAR}
              alt={entryDoc.participant?.userName || 'Deltager'}
              className={styles.avatar}
            />
            <span className={styles.title}>
              {entryDoc.participant?.userName ?? 'Ukendt deltager'}
            </span>
          </div>

          {/* ── 2. image ── */}
          <img
            className={styles.image}
            src={entryDoc.imageUrl ?? PLACEHOLDER_IMG}
            alt="Entry"
          />

          {/* ── 3. vote count + buttons ── */}
          <div className={styles.actions}>
            <button
              onClick={() => toggleVote(entryDoc._id)}
              disabled={authLoading || votingMap[entryDoc._id]}
              className={`${styles.voteBtn} ${votedMap[entryDoc._id] ? styles.voted : ''}`}
            >
              {votedMap[entryDoc._id] ? <FaHeart /> : <FaRegHeart />}{' '}
              {votesMap[entryDoc._id] ?? 0}
            </button>
            <button
              onClick={() => shareEntry(entryDoc._id)}
              className={styles.shareBtn}
            >
              <FaShareAlt /> Del
            </button>
          </div>

          {/* ── 4. description / caption ── */}
          {entryDoc.caption && (
            <p className={styles.caption}>{entryDoc.caption}</p>
          )}
        </section>
      ))}

      {/* ── 5. load more ── */}
      {hasMore && !loading && (
        <button className={styles.loadMore} onClick={loadMore}>
          Load more
        </button>
      )}
    </main>
  );
}
