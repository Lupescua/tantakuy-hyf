'use client';

import { useEffect, useRef, useState } from 'react';
import API from '@/utils/axios';
import CompetitionCard from './CompetitionCard';
import Loader from '../loader/Loader';
import styles from './CompetitionList.module.css';

/* ------------------------------------------------------------------ *
|  <CompetitionList />                                                |
|  – If parent passes a `competitions` prop, we render that data.     |
|  – Otherwise we fetch /api/competitions ourselves.                  |
|  – For every competition that has a `company` field we fire         |
|    /api/companies/get-company-name?companyId=… (once per ID).       |
* ------------------------------------------------------------------ */

export default function CompetitionList({ competitions: propData }) {
  /* ---------- 1. source list ------------------------------------- */
  const [competitions, setCompetitions] = useState(propData ?? []);
  const [loadingComps, setLoadingComps] = useState(!propData); // skip fetch if prop provided
  const [error, setError] = useState(null);

  useEffect(() => {
    if (propData) return; // parent already provided data
    (async () => {
      try {
        const { data } = await API.get('/competitions');
        setCompetitions(data?.data ?? []); // route returns { data: [...] }
      } catch (err) {
        console.error('Error fetching competitions:', err);
        setError('Could not load competitions.');
      } finally {
        setLoadingComps(false);
      }
    })();
  }, [propData]);

  /* ---------- 2. company-name map -------------------------------- */
  const [companyNames, setCompanyNames] = useState({});
  const hasFetchedNames = useRef(false);

  useEffect(() => {
    if (!competitions.length || hasFetchedNames.current) return;
    hasFetchedNames.current = true;
    (async () => {
      try {
        const ids = [
          ...new Set(competitions.map((c) => c.company).filter(Boolean)),
        ];

        const results = await Promise.all(
          ids.map(async (id) => {
            const { data } = await API.get('/companies/get-company-name', {
              params: { companyId: id },
            });
            return { id, name: data?.success ? data.name : 'Unknown company' };
          }),
        );

        const map = Object.fromEntries(results.map((r) => [r.id, r.name]));
        setCompanyNames(map);
      } catch (e) {
        console.error('Failed to fetch company names:', e);
      }
    })();
  }, [competitions]);

  /* ---------- 3. UI ---------------------------------------------- */
  if (loadingComps) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!competitions.length) return <p>No competitions found.</p>;

  return (
    <div className={styles.list}>
      {competitions.map((c) => (
        <div key={c._id}>
          {/* company name (if present) – optional heading */}
          {c.company && (
            <p className={styles.companyName}>
              {companyNames[c.company] ?? '…'}
            </p>
          )}

          <CompetitionCard
            competition={c}
            /* overview page never shows actions / counts */
            showActions={false}
            showVoteCount={false}
          />
        </div>
      ))}
    </div>
  );
}
