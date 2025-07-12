import { Suspense } from 'react';
import ForgotPasswordClient from './ForgotPasswordClient';
import Loader from '../components/loader/Loader';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ForgotPasswordClient />
    </Suspense>
  );
}
