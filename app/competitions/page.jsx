'use client';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const res = await fetch('/api/competitions');
        const data = await res.json();
        setCompetitions(data.data || []);
      } catch (err) {
        console.error('Failed to load competitions:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompetitions();
  }, []);

  return (
    <>
      <main className={styles.mainContent}>
        <h1>Igangværende Konkurrencer</h1>
        <CompetitionList />
      </main>
    </>
  );
}
