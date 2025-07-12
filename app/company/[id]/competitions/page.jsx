'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import API from '@/utils/axios';
import CompanyCompetitionItem from '@/app/components/company-profile/CompanyCompetitionItem';
import styles from './CompanyCompetitionList.module.css';
import CreateCompetitionCard from '@/app/components/company-profile/CreateCompetitionCard';

export default function CompanyCompetitionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const companyId = params.id;

  const [competitions, setCompetitions] = useState([]);
  const [error, setError] = useState(null);

  // Redirect if not company or wrong ID
  useEffect(() => {
    if (
      !loading &&
      (!user || user.role !== 'company' || user.id !== companyId)
    ) {
      router.replace('/');
    }
  }, [loading, user, companyId, router]);

  // Fetch competitions
  useEffect(() => {
    if (!user || user.id !== companyId) return;

    const fetchCompetitions = async () => {
      try {
        const res = await API.get('/competitions', {
          params: {
            companyId: companyId,
            sort: 'date', // optional, or 'popularity' if needed
          },
        });
        if (res.data.success) {
          setCompetitions(res.data.data);
        }
      } catch (err) {
        setError('Kunne ikke indlæse konkurrencer');
        console.error(err);
      }
    };

    fetchCompetitions();
  }, [companyId, user]);

  const handleDelete = async (id) => {
    if (!confirm('Er du sikker på, at du vil slette denne konkurrence?'))
      return;

    try {
      await API.delete(`/competitions/${id}`);
      setCompetitions((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  if (loading || user?.id !== companyId) return null;

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.pageTitle}>Mine konkurrencer</h3>
        {error && <p>{error}</p>}
        <CreateCompetitionCard companyId={user.id} />
        <div className={styles.competitionsList}>
          {competitions.length === 0 ? (
            <p>Ingen konkurrencer endnu.</p>
          ) : (
            competitions.map((comp) => (
              <CompanyCompetitionItem
                key={comp._id}
                id={comp._id}
                title={comp.title}
                createdAt={comp.createdAt}
                startDate={comp.startDate}
                endDate={comp.endDate}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
