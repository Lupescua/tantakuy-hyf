'use client';

import { useState, useEffect } from 'react';
import { FaTrophy } from 'react-icons/fa';
import API from '@/utils/axios';
import Loader from '../loader/Loader';
import styles from './DrawWinner.module.css';

export default function DrawWinner({ competitionId, onClose }) {
  const [step, setStep] = useState('choose');
  const [method, setMethod] = useState('random');
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prevent background scroll
  useEffect(() => {
    const block = (e) =>
      ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '].includes(e.key) &&
      e.preventDefault();
    window.addEventListener('keydown', block);
    return () => window.removeEventListener('keydown', block);
  }, []);

  const draw = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post(`/competitions/${competitionId}/draw`, {
        method,
      });
      setWinner(data.winner);
      setStep('result');
    } catch (err) {
      setError(err.response?.data?.error || 'Noget gik galt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <button className={styles.modalCloseBtn} onClick={onClose}>
          ✕
        </button>

        {step === 'choose' ? (
          <>
            <h2>Vælg hvordan vinderen skal trækkes</h2>
            <div className={styles.options}>
              {['likes', 'shares', 'random'].map((m) => (
                <label key={m}>
                  <input
                    type="radio"
                    value={m}
                    checked={method === m}
                    onChange={() => setMethod(m)}
                  />{' '}
                  {m === 'likes'
                    ? 'Mest stemmer'
                    : m === 'shares'
                      ? 'Mest delinger'
                      : 'Tilfældig'}
                </label>
              ))}
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.modalActions}>
              <button onClick={onClose}>Annuller</button>
              <button onClick={draw} disabled={loading}>
                {loading ? <Loader /> : <FaTrophy style={{ marginRight: 4 }} />}
                Træk vinder
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Vinder fundet!</h2>
            {winner ? (
              <a
                href={winner.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.winnerLink}
              >
                Gå til vinders bidrag →
              </a>
            ) : (
              <p>Ingen vinder kunne findes.</p>
            )}
            <div className={styles.modalActions}>
              <button onClick={onClose}>Luk</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
