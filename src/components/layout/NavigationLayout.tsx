'use client';

import { usePathname } from 'next/navigation';

interface NavigationLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
}

export default function NavigationLayout({ children, sidebar, header }: NavigationLayoutProps) {
  const pathname = usePathname();
  
  // Hide sidebar/header on login pages
  const isLoginPage = pathname === '/login' || pathname === '/admin/login' || pathname === '/register' || pathname === '/forgot-password' || pathname.startsWith('/reset-password');

  if (isLoginPage) {
    return (
      <div className="login-root">
        <main className="login-content">
          {children}
        </main>
        <style jsx>{`
          .login-root {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: hsl(var(--background));
          }
          .login-content {
            width: 100%;
            max-width: 500px;
            padding: 2rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="layout-root">
      {sidebar}
      <div className="main-container">
        {header}
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
}
