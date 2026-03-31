'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Users } from 'lucide-react';
import styles from './AdminTabs.module.css';

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <div className={styles.tabsContainer}>
      <Link 
        href="/admin/posts" 
        className={`${styles.tab} ${pathname.startsWith('/admin/posts') ? styles.active : ''}`}
      >
        <FileText size={18} />
        <span>Posts Management</span>
      </Link>
      <Link 
        href="/admin/users" 
        className={`${styles.tab} ${pathname.startsWith('/admin/users') ? styles.active : ''}`}
      >
        <Users size={18} />
        <span>User Management</span>
      </Link>
    </div>
  );
}
