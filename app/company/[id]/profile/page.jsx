import { redirect } from 'next/navigation';
import { getUserFromCookie } from '@/utils/server/auth';

export default async function CompanyProfilePage(context) {
  const { id } = await context.params;
  const user = await getUserFromCookie();

  if (!user || user.id !== id || user.role !== 'company') {
    return redirect('/unauthorized');
  }

  return (
    <>
      <h1>Virksomhedsprofil</h1>
      <p>
        Her kan du se og redigere dine virksomhedsoplysninger og oprette din
        virksomhedsprofil.
      </p>
      {/* Add your company profile form or info here */}
    </>
  );
}
