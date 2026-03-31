import { getPosts } from '@/app/actions/post-actions';
import styles from './page.module.css';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

import AdminTabs from '@/components/admin/AdminTabs';

export default async function AdminPosts() {
  const posts = await getPosts({ limit: 100 });

  return (
    <div className={styles.adminContainer}>
      <AdminTabs />
      <header className={styles.adminHeader}>
        <h1>Posts Management</h1>
        <Link href="/admin/editor" className={styles.createBtn}>
          <Plus size={18} />
          <span>New Post</span>
        </Link>
      </header>

      <div className={styles.postTableWrapper}>
        <table className={styles.postTable}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.categoryName}</td>
                <td>
                  <span className={post.published ? styles.statusPublished : styles.statusDraft}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className={styles.actions}>
                  <Link href={`/admin/editor?id=${post.id}`} className={styles.editBtn}>
                    <Edit size={16} />
                  </Link>
                  <button className={styles.deleteBtn}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
