'use client';
import { mockUser, mockCompetitions } from "@/app/participant/[id]/profile/mockData"
import CompetitionItem from './CompetitionItem';
import styles from './ProfileSection.module.css';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from "react";
import API from "@/utils/axios";

export default function ProfileSection() {
  const { user, loading, refresh } = useAuth();
  const [data, setData] = useState([])
  useEffect(() => {
    if (!loading && user) {
      const fetchData = async () => {
        if (!user?._id) return;
  
        try {
          const res = await API.get(`/profile/${user._id}`);
          const result = await res.data;
          console.log(result)
  
          if (result.success) {
            
            setData(Array.isArray(result.data) ? result.data : [result.data]);
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

  if (loading)
    return (<h1>loading...</h1>)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>
          {user.userName}
        </h2>
        <div className={styles.avatar}>
          {user.userName[0]}
          {user.email[0]}
        </div>
        <p className={styles.region}>{mockUser.region}</p>
      </div>

      <div className={styles.about}>
        <h3>About:</h3>
        <p>{user.email}</p>
      </div>

      <div className={styles.competitions}>
        <h3>Konkurrencer deltaget i</h3>
        <div className={styles.competitionsList}>
          {data.map((item, index) => (
            <CompetitionItem
              key={index}
              id={item.id}
              title={item.title}
              organizer={item.organizer}
              likes={item.likes}
              shares={item.shares}
              saved={item.saved}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
