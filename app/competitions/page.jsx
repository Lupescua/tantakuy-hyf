'use client';
import { useState, useEffect } from 'react';
import API from '@/utils/axios';
import CompetitionList from '../components/competitions/CompetitionList';
import styles from "./page.module.css"

export default function CompetitionsPage() {
  const [competitions, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
useEffect(()=> {
  async function fetchCompetition(){
    try {
      const res = await API.get('/competitions')
      console.log(res.data.data)
      setCompetition(res.data.data)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  fetchCompetition();
},[])
if (loading) return <div>Loading...</div>;
if (!competitions) return <div>Competition not found</div>;
  return (
    <>
      <main className={styles.mainContent}>
        {/* <h1>Igangværende Konkurrencer</h1> */}
        <CompetitionList competitions={competitions || []} />
      </main>
    </>
  );
}
