'use client';

import { useEffect, useState } from 'react';
import { getCompetitionById } from '@/app/services/competitionService';
import style from '@/style/CompetitionDetailsModal.module.css';
import Loader from '../loader/Loader';
import axios from 'axios';

export default function CompetitionDetailsModal({ competitionId }) {
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => {
    if (open && competitionId) {
      console.log('Fetching competition with ID:', competitionId);
      setLoading(true);
      getCompetitionById(competitionId)
        .then(setCompetition)
        .catch((err) => {
          console.error('Failed to fetch competition:', err);
        })
        .finally(() => setLoading(false));

      axios
        .get(`/api/entries?competitionId=${competitionId}`)
        .then((response) => {
          setEntryCount(response.data.length);
        })
        .catch((err) => {
          console.error('Failed to fetch entry count:', err);
        });
    }
  }, [open, competitionId]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event) {
      if (
        ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '].includes(event.key)
      ) {
        event.preventDefault();
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!competitionId) return null;

  return (
    <>
      {!open ? (
        <span onClick={() => setOpen(true)}>
          <p>om</p>
        </span>
      ) : (
        <div>
          <div className={style.overlay}>
            <div className={`${style.modalContainer}`}>
              <button
                className={style.modalCloseBtn}
                onClick={() => setOpen(false)}
              >
                ✕
              </button>

              {loading ? (
                <Loader></Loader>
              ) : competition ? (
                <>
                  <div className={style.modalDetail}>
                    <div className={style.card}>
                      <p>Antal deltagere indtil videre: {entryCount}</p>
                      <p>
                        Deadline:{' '}
                        {new Date(
                          competition.participationDeadline,
                        ).toLocaleDateString()}
                      </p>
                      <p>Præmie: {competition.prize}</p>
                    </div>

                    <div className={style.description}>
                      <p>
                        <strong>Beskrivelse:</strong>
                      </p>
                      <p>{competition.description}</p>
                    </div>
                    <div className={style.competitionTerms}>
                      <p>
                        <strong>Vilkår:</strong>
                      </p>
                      <p>{competition.competitionTerms}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p>Konkurrence ikke fundet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
