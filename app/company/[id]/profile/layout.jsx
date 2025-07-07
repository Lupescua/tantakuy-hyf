'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CompanyProfileNavbar from '@/app/components/layouts/CompanyProfileNavbar';
import Sidebar from '@/app/components/layouts/Sidebar';
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
  }, [loading, user, router]);

  if (loading) return null;
  if (!user || user.role !== 'company') return null;

  return (
    <>
      <CompanyProfileNavbar onHamburgerClick={() => setSidebarOpen(true)} />
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        companyId={user.id}
      />
      <main className={styles.mainContent}>{children}</main>
    </>
  );
}
