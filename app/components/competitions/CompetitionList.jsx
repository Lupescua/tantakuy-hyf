import CompetitionCard from './CompetitionCard';
import styles from './CompetitionList.module.css';
import API from '@/utils/axios'; 
import { useRef, useEffect, useState } from 'react';


export default function CompetitionList({ competitions }) {
  const [companyNames, setCompanyNames] = useState({});
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(true);

 

  useEffect(() => {
    const fetchCompanyNames = async () => {
      if (!competitions || !Array.isArray(competitions)) return;
      hasFetched.current = true;
      setLoading(false);
      const ids = competitions.map((c) => c.company).filter(Boolean);

      const uniqueIds = [...new Set(ids)];

      try {
        const results = await Promise.all(
          uniqueIds.map(async (companyId) => {
            const response = await API.get(`/companies/get-company-name`, { params: { companyId } });
            if (response.data.success) {
              return { id: companyId, name: response.data.name };
            } else {
              return { id: companyId, name: 'Unknown Company' };
            }
          })
        );

        const namesMap = {};
        results.forEach(({ id, name }) => {
          namesMap[id] = name;
        });
        
        setCompanyNames(namesMap);
      } catch (error) {
        console.error('Failed to fetch company names:', error);
      }
    };

    fetchCompanyNames();
  }, [competitions]);

  if (!competitions || !Array.isArray(competitions)) {
    return <p>No competitions found</p>;
  }
  if (loading) return <p>Loading company names...</p>;

  return (
    <div className={styles.list}>
      {competitions.map((competition) => (
        <div key={competition._id || competition.id}>
          <h1>{competition.title}</h1>
          <p className={styles.companyName}>
            {companyNames[competition.company] || 'Loading company...'}
          </p>
          <CompetitionCard competition={competition} />
        </div>
      ))}
    </div>
  );
}
