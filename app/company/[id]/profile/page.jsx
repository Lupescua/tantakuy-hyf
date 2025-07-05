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
      <h1>Company Profile</h1>
      <p>
        Here you can view and edit your company information, and create your
        company profile.
      </p>
      {/* Add your company profile form or info here */}
    </>
  );
}
