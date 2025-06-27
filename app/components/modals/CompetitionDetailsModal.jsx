'use client';
import { useEffect, useState } from 'react';
import { fetchCompetitionById } from '@/utils/fetchCompetitionById';

export default function CompetitionDetailsModal({ competitionId, onClose }) {
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!competitionId) return;

    setLoading(true);
    fetchCompetitionById(competitionId)
      .then(setCompetition)
      .catch((err) => {
        console.error('Failed to fetch competition:', err);
      })
      .finally(() => setLoading(false));
  }, [competitionId]);

  if (!competitionId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : competition ? (
          <>
            <h2 className="text-2xl font-bold mb-2">{competition.title}</h2>
            <p className="text-gray-600 mb-4">{competition.description}</p>
            <div className="text-sm text-gray-500">
              <p>
                <strong>Ends:</strong>{' '}
                {new Date(competition.endDate).toLocaleDateString()}
              </p>
              {competition.winnerSelectionDate && (
                <p>
                  <strong>Winner Announced:</strong>{' '}
                  {new Date(competition.winnerSelectionDate).toLocaleDateString()}
                </p>
              )}
              <p>
                <strong>Terms:</strong> {competition.competitionTerms}
              </p>
            </div>
          </>
        ) : (
          <p>Competition not found.</p>
        )}
      </div>
    </div>
  );
}