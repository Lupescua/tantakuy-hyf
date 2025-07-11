'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/utils/axios';
import CompetitionList from '@/app/components/competitions/CompetitionList';
import Loader from './components/loader/Loader';
import { useMobileSearch } from '../context/MobileSearchContext';

export default function Home() {
  const router = useRouter();
  const { showMobileSearch } = useMobileSearch();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [sort, setSort] = useState('popularity');
  const [companies, setCompanies] = useState([]);

  // Fetch competitions with filters
  useEffect(() => {
    const fetchCompetitions = async () => {
      setLoading(true);
      try {
        const { data } = await API.get('/competitions', {
          params: {
            search,
            companyId,
            sort,
          },
        });
        setCompetitions(data?.data ?? []);
      } catch (err) {
        console.error('Failed to fetch competitions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompetitions();
  }, [search, companyId, sort]);

  // Fetch companies for dropdown (optional enhancement)
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const res = await API.get('/companies');
        setCompanies(res.data?.data || []);
      } catch (e) {
        console.error('Failed to load companies:', e);
      }
    };
    loadCompanies();
  }, []);

  return (
    <main className="home">
      <section className="hero">
        <h2 className="hero-title">Konkurrencer</h2>
        <p className="hero-subtitle">
          Udforsk kreative konkurrencer og deltag i udfordringer, der belønner
          engagement, originalitet og indflydelse.
        </p>

        <div className="filters">
          <input
            type="text"
            placeholder="Søg efter titel eller firma..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          >
            <option value="">Alle udbydere</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.companyName}
              </option>
            ))}
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popularity">Popularitet</option>
            <option value="date">Dato</option>
          </select>
        </div>
      </section>

      <section className="competition-preview">
        {loading ? <Loader /> : <CompetitionList competitions={competitions} />}
      </section>

      {showMobileSearch && (
        <div className="mobile-search-wrapper">
          <input
            type="text"
            placeholder="Søg..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mobile-search-input"
          />
        </div>
      )}
    </main>
  );
}
