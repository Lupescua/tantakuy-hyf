import { Suspense } from 'react';
import ForgotPasswordClient from './ForgotPasswordClient';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Indlæser...</div>}>
      <ForgotPasswordClient />
    </Suspense>
  );
}
