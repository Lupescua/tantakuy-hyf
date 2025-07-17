'use client';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import EntryForm from '../../components/participant/entry-form';
import Loader from '@/app/components/loader/Loader';

export default function ParticipantEntryPage() {
  const { competitionId } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <Loader />;
  if (!user) {
    // if not logged in, bounce to login
    router.push('/login');
    return null;
  }

  return (
    <>
      <EntryForm userId={user.id} competitionId={competitionId} />
    </>
  );
}
