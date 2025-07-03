"use client";
import { useState } from "react";
import CompanyProfileNavbar from '../../components/layouts/CompanyProfileNavbar';
import Sidebar from '../../components/layouts/Sidebar';
import styles from './CompanyProfilePage.module.css';

export default function CompanyProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <h1>Company Profile</h1>
      <p>Here you can view and edit your company information, and create your company profile.</p>
      {/* Add your company profile form or info here */}
    </>
  );
} 