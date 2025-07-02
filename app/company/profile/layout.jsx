"use client";
import { useState } from "react";
import CompanyProfileNavbar from '../../components/layouts/CompanyProfileNavbar';
import Sidebar from '../../components/layouts/Sidebar';
import styles from './CompanyProfilePage.module.css';

export default function CompanyProfileLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <CompanyProfileNavbar onHamburgerClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </>
  );
} 