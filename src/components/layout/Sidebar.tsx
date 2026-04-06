import Link from 'next/link';
import { 
  Home, 
  Users, 
  HelpCircle, 
  LayoutDashboard
} from 'lucide-react';
import styles from './Sidebar.module.css';

import MemberLogoutButton from '@/components/MemberLogoutButton';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
];

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/posts' },
  { icon: Users, label: 'Users', href: '/admin/users' },
];

interface SidebarProps {
  isAdmin?: boolean;
}

export default function Sidebar({ isAdmin }: SidebarProps) {

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Link href="/">
          <span className={styles.logoText}>Ponzu Academy</span>
        </Link>
      </div>

      <nav className={styles.nav}>
        <div className={styles.sectionLabel}>MENU</div>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className={styles.navLink}>
                <item.icon size={20} strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {isAdmin && (
          <>
            <div className={`${styles.sectionLabel} ${styles.adminSection}`}>MANAGEMENT</div>
            <ul className={styles.navList}>
              {adminNavItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={styles.navLink}>
                    <item.icon size={20} strokeWidth={1.5} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      <div className={styles.footer}>
        <Link href="/support" className={styles.footerLink}>
          <HelpCircle size={18} strokeWidth={1.5} />
          <span>Support</span>
        </Link>
        <MemberLogoutButton className={styles.footerLink} />
      </div>
    </aside>
  );
}
