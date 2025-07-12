'use client';
import CompetitionItem from './CompetitionItem';
import styles from './ProfileSection.module.css';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import API from '@/utils/axios';
import { useRouter } from 'next/navigation';
import Loader from '../loader/Loader';

export default function ProfileSection() {
  const { user, loading, refresh } = useAuth();
  const [competitions, setCompetitions] = useState([]);
  const router = useRouter();

  // Redirect after logout or if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [loading, user, router]);

  //actual fetching for user info
  useEffect(() => {
    if (!loading && user) {
      const fetchData = async () => {
        try {
          const res = await API.get(`/profile/${user.id}`);

          const result = res.data;

          if (result.success && Array.isArray(result.data)) {
            setCompetitions(result.data);
          } else {
            console.warn('No data found:', result.error);
          }
        } catch (error) {
          console.error('Fetch error:', error);
        }
      };

      fetchData();
    }
  }, [user, loading]);

  if (loading || !user) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{user.userName}</h2>
        <div className={styles.avatar}>
          {user.userName[0]}
          {user.email[0]}
        </div>
        <p className={styles.region}>{user.region || 'Ingen region angivet'}</p>
      </div>

      <div className={styles.about}>
        <h3>Om:</h3>
        <p>{user.email}</p>
      </div>

      <div className={styles.competitions}>
        <h3>Konkurrencer deltaget i</h3>
        <div className={styles.competitionsList}>
          {competitions.length > 0 ? (
            competitions.map((item, index) => {
              console.log('PROFILE ITEM:', item);
              return (
                <CompetitionItem
                  key={index}
                  id={item.id}
                  title={item.title}
                  companyName={item.company}
                  likes={item.likes}
                  shares={item.shares}
                  saved={item.saved}
                  imageUrl={item.imageUrl}
                  onDelete={(deleteId) => {
                    setCompetitions((prev) =>
                      prev.filter((c) => c.id !== deleteId),
                    );
                  }}
                />
              );
            })
          ) : (
            <p>Ingen konkurrencer fundet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
