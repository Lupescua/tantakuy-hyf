'use client';

import { useEffect, useState } from 'react';
import { getCompetitionById } from '@/app/services/competitionService';
import style from '@/style/CompetitionDetailsModal.module.css';
import Loader from '../loader/Loader';

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

      fetch(`/api/entries?competitionId=${competitionId}`)
        .then((res) => res.json())
        .then((data) => {
        setEntryCount(data.length);
        })
        .catch((err) => {
          console.error('Failed to fetch etry count:', err);
        });
    }
  }, [open, competitionId]);

  if (!competitionId) return null;

  return (
    <>
      {!open ? (
        <span onClick={() => setOpen(true)}>
          <p>om</p>
        </span>
      ) : (
        <div>
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
                <div>
                  <p>
                    <strong>Antal deltagere:</strong> {entryCount}
                  </p>
                  <p>
                    <strong>Deadline:</strong>{' '}
                    {new Date(
                      competition.participationDeadline,
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Præmie:</strong> {competition.prize}
                  </p>

                  <p>
                    <strong>Beskrivelse:</strong> {competition.description}
                  </p>
                  <p>
                    <strong>Vilkår:</strong> {competition.competitionTerms}
                  </p>
                </div>
              </>
            ) : (
              <p>Competition not found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
