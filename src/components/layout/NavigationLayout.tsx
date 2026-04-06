'use client';

import { usePathname } from 'next/navigation';

interface NavigationLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
}

import styles from './NavigationLayout.module.css';

export default function NavigationLayout({ children, sidebar, header }: NavigationLayoutProps) {
  const pathname = usePathname();
  
  // Hide sidebar/header on login pages
  const isLoginPage = pathname === '/login' || pathname === '/admin/login' || pathname === '/register' || pathname === '/forgot-password' || pathname.startsWith('/reset-password');

  if (isLoginPage) {
    return (
      <div className={styles.loginRoot}>
        <main className={styles.loginContent}>
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className={styles.layoutRoot}>
      {sidebar}
      <div className={styles.mainContainer}>
        {header}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
