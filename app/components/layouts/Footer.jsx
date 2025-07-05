'use client';

import { useAuth } from '@/context/AuthContext';
import FooterLoggedOut from './FooterLoggedOut/FooterLoggedOut';
import FooterLoggedIn from './FooterLoggedIn/FooterLoggedIn';

export default function Navbar() {
  const { user, loading } = useAuth();

  if (loading) {
    return <></>;
  }

  // once loading is done, pick the right bar
  return user ? <FooterLoggedIn /> : <FooterLoggedOut />;
}
