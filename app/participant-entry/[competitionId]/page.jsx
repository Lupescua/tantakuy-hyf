import { getUserFromCookie } from '@/utils/server/auth';
import EntryForm from '../../components/participant/entry-form';
export default async function ParticipantEntryPage({ params }) {
  const user = await getUserFromCookie(); 
  const { competitionId } = await params;
  console.log("this is competition", competitionId)

  return (
    <div>
      <EntryForm userId={user?.id} competitionId={competitionId} />
    </div>
  );
}
