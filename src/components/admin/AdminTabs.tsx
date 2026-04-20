'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Users, Tag, Video } from 'lucide-react';
import styles from './AdminTabs.module.css';

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <div className={styles.tabsContainer}>
      <Link 
        href="/admin/posts" 
        className={`${styles.tab} ${pathname.startsWith('/admin/posts') && !pathname.includes('/admin/videos') ? styles.active : ''}`}
      >
        <FileText size={18} />
        <span>Post Management</span>
      </Link>
      <Link 
        href="/admin/videos" 
        className={`${styles.tab} ${pathname.startsWith('/admin/videos') ? styles.active : ''}`}
      >
        <Video size={18} />
        <span>Video Management</span>
      </Link>
      <Link 
        href="/admin/categories" 
        className={`${styles.tab} ${pathname.startsWith('/admin/categories') ? styles.active : ''}`}
      >
        <Tag size={18} />
        <span>Category Management</span>
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
