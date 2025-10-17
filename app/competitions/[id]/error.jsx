'use client';

import { useEffect } from 'react';
import ErrorUI from '../../components/ErrorUI';

export default function CompetitionError({ error, reset }) {
  useEffect(() => {
    console.error('Competition page error:', error);
  }, [error]);

  return (
    <ErrorUI
      title="Konkurrence ikke tilgængelig"
      message="Vi kunne ikke indlæse denne konkurrence. Den kan være slettet eller utilgængelig."
      onRetry={reset}
      homeHref="/"
      homeText="Se alle konkurrencer"
    />
  );
}
