'use client'; // ← REQUIRED for using useRouter and useSearchParams

import { useSearchParams } from 'next/navigation';
import ForgotPasswordForm from '../components/forgot-password/ForgotPasswordForm';
import VerifyToken from '../components/forgot-password/VerifyToken';
import ResetPasswordForm from '../components/forgot-password/ResetPassword';

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const step = searchParams.get('step');

  const renderStep = () => {
    switch (step) {
      case 'verify':
        return <VerifyToken />;
      case 'reset':
        return <ResetPasswordForm />;
      default:
        return <ForgotPasswordForm />;
    }
  };

  return <div>{renderStep()}</div>;
}
