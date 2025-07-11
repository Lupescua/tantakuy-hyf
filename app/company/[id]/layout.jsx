'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CompanyProfileNavbar from '@/app/components/layouts/CompanyProfileNavbar';
import Sidebar from '@/app/components/layouts/Sidebar';
import styles from './profile/CompanyProfilePage.module.css';
import { useAuth } from '@/context/AuthContext';

export default function CompanyProfileLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'company' || user.id !== id) {
      router.replace('/');
    }
  }, [loading, user, id, router]);

  if (loading || !user || user.role !== 'company' || user.id !== id) {
    return null;
  }

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
