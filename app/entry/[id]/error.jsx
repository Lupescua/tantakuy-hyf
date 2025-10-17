'use client';

import { useEffect } from 'react';
import ErrorUI from '../../components/ErrorUI';

export default function EntryError({ error, reset }) {
  useEffect(() => {
    console.error('Entry page error:', error);
  }, [error]);

  return (
    <ErrorUI
      title="Bidrag ikke tilgængeligt"
      message="Vi kunne ikke indlæse dette bidrag. Det kan være slettet eller utilgængeligt."
      onRetry={reset}
      homeHref="/"
      homeText="Se alle konkurrencer"
    />
  );
}
