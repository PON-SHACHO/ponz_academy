import { getPosts } from '@/app/actions/post-actions';
import styles from '../posts/page.module.css';
import Link from 'next/link';
import { Plus, Edit, Video } from 'lucide-react';
import DeletePostButton from '@/components/admin/DeletePostButton';
import AdminTabs from '@/components/admin/AdminTabs';
import { getPostThumbnail } from '@/lib/video-utils';

export default async function AdminVideos() {
  // Fetch more posts and filter for those with videoUrl or in "動画" category
  const allPosts = await getPosts({ limit: 100 });
  const videoPosts = allPosts.filter(p => p.videoUrl || p.categoryName === '動画');

  return (
    <div className={styles.adminContainer}>
      <AdminTabs />
      <header className={styles.adminHeader}>
        <h1>Video Management</h1>
        <Link href="/admin/videos/editor" className={styles.createBtn}>
          <Plus size={18} />
          <span>New Video Post</span>
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
            {videoPosts.length > 0 ? (
              videoPosts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '48px', height: '27px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#e9ecef', flexShrink: 0 }}>
                        {getPostThumbnail(post) ? (
                          <img src={getPostThumbnail(post)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Video size={14} color="#adb5bd" />
                          </div>
                        )}
                      </div>
                      <div style={{ fontWeight: 500 }}>{post.title}</div>
                    </div>
                  </td>
                  <td>{post.categoryName}</td>
                  <td>
                    <span className={post.published ? styles.statusPublished : styles.statusDraft}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className={styles.actions}>
                    <Link href={`/admin/videos/editor?id=${post.id}`} className={styles.editBtn}>
                      <Edit size={16} />
                    </Link>
                    <DeletePostButton postId={post.id} className={styles.deleteBtn} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  No video posts found. Click "New Video Post" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
