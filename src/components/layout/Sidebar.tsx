import Link from 'next/link';
import { 
  Home, 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3, 
  HelpCircle, 
  ChevronRight
} from 'lucide-react';
import styles from './Sidebar.module.css';

import MemberLogoutButton from '@/components/MemberLogoutButton';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Link href="/">
          <span className={styles.logoText}>Ponzu Academy</span>
        </Link>
      </div>

      <nav className={styles.nav}>
        <div className={styles.sectionLabel}>MANAGEMENT</div>
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
