'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { FaRegBuilding, FaBars, FaThLarge, FaRegUser } from 'react-icons/fa';

export default function CompanyProfileSidebar({ companyId, open, setOpen }) {
  const pathname = usePathname();

  const navItems = [
    {
      href: `/company/${companyId}/profile`,
      icon: <FaRegBuilding style={{ marginRight: '8px' }} />,
      label: 'Virksomhedsoplysninger',
    },
    {
      href: `/company/${companyId}/competitions`,
      icon: <FaBars style={{ marginRight: '8px' }} />,
      label: 'Mine konkurrencer',
    },
    {
      href: `/company/${companyId}/dashboard`,
      icon: <FaThLarge style={{ marginRight: '8px' }} />,
      label: 'Dashboard',
    },
    {
      href: `/company/${companyId}/settings`,
      icon: <FaRegUser style={{ marginRight: '8px' }} />,
      label: 'Indstillinger',
    },
  ];

  return (
    <>
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <nav>
          <h2 className={styles.sidebarTitle}>Oversigt</h2>
          <ul className={styles.sidebarList}>
            {navItems.map((item) => (
              <li
                key={item.href}
                className={pathname === item.href ? styles.active : ''}
              >
                <Link
                  href={item.href}
                  className={styles.sidebarButton}
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      )}
    </>
  );
}
