'use client';

import { useState, useEffect } from 'react';
import { getCategories, saveCategory, deleteCategory } from '@/app/actions/post-actions';
import { Category } from '@/types';
import AdminTabs from '@/components/admin/AdminTabs';
import styles from '../posts/page.module.css';
import { Plus, Edit, Trash2, Tag, Loader2, X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CategoryManagement() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [id, setId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    const data = await getCategories();
    setCategories(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    const result = await saveCategory({ id, name, slug });
    setIsSubmitting(false);
    
    if (result.success) {
      resetForm();
      fetchCategories();
      router.refresh();
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleDelete = async (catId: string) => {
    if (!confirm('このカテゴリーを削除してもよろしいですか？')) return;
    
    const result = await deleteCategory(catId);
    if (result.success) {
      fetchCategories();
      router.refresh();
    } else {
      alert('Error: ' + result.error);
    }
  };

  const startEdit = (cat: Category) => {
    setId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setIsEditing(true);
  };

  const resetForm = () => {
    setId(undefined);
    setName('');
    setSlug('');
    setIsEditing(false);
  };

  return (
    <div className={styles.adminContainer}>
      <AdminTabs />
      
      <header className={styles.adminHeader}>
        <h1>Category Management</h1>
      </header>

      <section style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ marginBottom: '16px', color: '#2D4F4F' }}>
          {isEditing ? 'カテゴリーを編集' : '新しいカテゴリーを追加'}
        </h3>
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6C757D' }}>カテゴリー名</label>
            <input 
              type="text" 
              placeholder="例: マーケティング" 
              style={{ padding: '10px', border: '1px solid #E9ECEF', borderRadius: '8px' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6C757D' }}>スラッグ (任意)</label>
            <input 
              type="text" 
              placeholder="例: marketing" 
              style={{ padding: '10px', border: '1px solid #E9ECEF', borderRadius: '8px' }}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={styles.createBtn}
              style={{ border: 'none', cursor: 'pointer', height: '42px', padding: '0 20px' }}
            >
              {isSubmitting ? <Loader2 className="spin" size={18} /> : (isEditing ? <Check size={18} /> : <Plus size={18} />)}
              <span>{isEditing ? '更新' : '追加'}</span>
            </button>
            {isEditing && (
              <button 
                type="button" 
                onClick={resetForm}
                style={{ background: '#F8F9FA', color: '#495057', border: '1px solid #E9ECEF', borderRadius: '8px', cursor: 'pointer', padding: '0 12px' }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </form>
      </section>

      <div className={styles.postTableWrapper}>
        <table className={styles.postTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '40px' }}>
                  <Loader2 className="spin" size={24} style={{ color: '#6b46c1' }} />
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag size={16} color="#6b46c1" />
                      <span style={{ fontWeight: 500 }}>{cat.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '0.9rem' }}>{cat.slug}</td>
                  <td className={styles.actions} style={{ justifyContent: 'flex-end' }}>
                    <button onClick={() => startEdit(cat)} className={styles.editBtn} title="編集">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className={styles.deleteBtn} title="削除">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  カテゴリーがありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
