import { getPostByIdOrSlug, getCategories } from '@/app/actions/post-actions';
import styles from './page.module.css';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import AdminLogoutButton from '@/components/AdminLogoutButton';
import EditorForm from '@/components/admin/EditorForm';

export default async function AdminEditor({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const [post, categories] = await Promise.all([
    id ? getPostByIdOrSlug(id) : null,
    getCategories()
  ]);

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.adminSidebar}>
        <div className={styles.adminLogo}>
          <span className={styles.logoMain}>Ponzu Admin</span>
          <span className={styles.logoSub}>Academy Manager</span>
        </div>

        <nav className={styles.adminNav}>
          <ul className={styles.navList}>
            <li><Link href="/admin"><LayoutDashboard size={20} /><span>Dashboard</span></Link></li>
            <li className={styles.active}><Link href="/admin/posts"><FileText size={20} /><span>Posts</span></Link></li>
            <li><Link href="/admin/members"><Users size={20} /><span>Members</span></Link></li>
            <li><Link href="/admin/analytics"><BarChart3 size={20} /><span>Analytics</span></Link></li>
            <li><Link href="/admin/settings"><Settings size={20} /><span>Settings</span></Link></li>
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/admin/editor" className={styles.newPostBtn}>
            <span>New Post</span>
          </Link>
          <div className={styles.footerLinks}>
            <Link href="/support"><HelpCircle size={18} /><span>Support</span></Link>
            <AdminLogoutButton className={styles.logoutBtn} />
          </div>
        </div>
      </aside>

      <main className={styles.editorMain}>
        <EditorForm initialPost={post} categories={categories} />
      </main>
    </div>
  );
}
