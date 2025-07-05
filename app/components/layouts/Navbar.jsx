'use client';

import { useAuth } from '@/context/AuthContext';
import NavbarLoggedOut from './NavbarLoggedOut/NavbarLoggedOut';
import NavbarLoggedIn from './NavbarLoggedIn/NavbarLoggedIn';

export default function Navbar() {
  const { user, loading } = useAuth();

  if (loading) {
    return <></>;
  }

  // once loading is done, pick the right bar
  return user ? <NavbarLoggedIn /> : <NavbarLoggedOut />;
}
