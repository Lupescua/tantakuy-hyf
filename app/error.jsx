'use client';

import { useEffect } from 'react';
import ErrorUI from './components/ErrorUI';

export default function AppError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <ErrorUI
      title="Noget gik galt"
      message="Der opstod en uventet fejl. Prøv venligst igen."
      onRetry={reset}
      homeHref="/"
      homeText="Gå til forsiden"
    />
  );
}
