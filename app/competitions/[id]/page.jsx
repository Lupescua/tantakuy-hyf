
import { notFound } from 'next/navigation';
import CompetitionGalleryPage from '@/app/competition/[id]/page';

async function getCompetition(id) {
  try {
    const res = await API.get(`/competitions/${id}`);
    if (!res.ok) notFound();
    return res.json();
  } catch (error) {
    notFound();
  }
}

export default async function CompetitionPage({ params }) {
  const { id } = params;

  const competition = await getCompetition(id);

  return (
    <div>
      <h1>{competition.title}</h1>
     
      <CompetitionDetail competition={competition} />
    </div>
  );
}