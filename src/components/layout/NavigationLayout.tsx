'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';

export default function NavigationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide sidebar/header on login pages
  const isLoginPage = pathname === '/login' || pathname === '/admin/login' || pathname === '/register';

  if (isLoginPage) {
    return (
      <div className="login-layout">
        <main className="login-content">
          {children}
        </main>
        <style jsx>{`
          .login-layout {
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
      <Sidebar />
      <div className="main-container">
        <Header />
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
}
