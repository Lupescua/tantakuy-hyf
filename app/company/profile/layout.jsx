'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CompanyProfileNavbar from '../../components/layouts/CompanyProfileNavbar';
import Sidebar from '../../components/layouts/Sidebar';
import styles from './CompanyProfilePage.module.css';
import { useAuth } from '@/context/AuthContext';

export default function CompanyProfileLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== 'company') {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) return null;

  if (user?.role !== 'company') {
    return <p>🚫 You are not authorized to view this page.</p>;
  }

  return (
    <>
      <CompanyProfileNavbar onHamburgerClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className={styles.mainContent}>{children}</main>
    </>
  );
}
