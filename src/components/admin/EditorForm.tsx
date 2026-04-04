'use client';

import { useState } from 'react';
import { savePost } from '@/app/actions/post-actions';
import { Post, Category } from '@/types';
import styles from '@/app/admin/editor/page.module.css';
import { Eye, Image as ImageIcon, ChevronDown, Clock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EditorFormProps {
  initialPost?: Post | null;
  categories: Category[];
}

export default function EditorForm({ initialPost, categories }: EditorFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Post>>(
    initialPost || {
      title: '',
      slug: '',
      subtitle: '',
      content: '',
      categoryId: categories[0]?.id || '',
      published: true,
    }
  );

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSaving(true);
    try {
      const result = await savePost(formData);
      if (result.success) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        alert('Error saving: ' + result.error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof Post, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'title' && !initialPost) {
       // Auto-generate slug from title if it's a new post
        const slug = value.toLowerCase()
           .trim()
           .replace(/[\s\t\n]+/g, '-') // Replace whitespace with hyphen
           .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF-]/g, '') // Allow Alphanumeric + Japanese (Hiragana, Katakana, Kanji) + Hyphens
           .replace(/-+/g, '-') // collapse multiple hyphens
           .replace(/^-+|-+$/g, '') // trim hyphens
           .slice(0, 50);
        setFormData(prev => ({ ...prev, slug }));
    }
  };

  return (
    <form className={styles.editorForm} onSubmit={handleSave}>
      <header className={styles.editorHeader}>
        <div className={styles.breadCrumbs}>
          <span>Workspace</span>
          <span className={styles.separator}>/</span>
          <span>Posts</span>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>{initialPost ? '編集' : '新規投稿作成'}</span>
        </div>
        <div className={styles.editorActions}>
          <button 
            type="button" 
            className={styles.secondaryBtn}
            onClick={() => handleSave()}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className={styles.spin} size={18} /> : '保存'}
          </button>
          <button type="button" className={styles.secondaryBtn}><Eye size={18} /> プレビュー</button>
          <button type="submit" className={styles.primaryBtn} disabled={isSaving}>
            {initialPost ? '更新する' : '公開する'}
          </button>
        </div>
      </header>

      <div className={styles.editorContent}>
        <div className={styles.writingArea}>
          <input 
            type="text" 
            placeholder="無題の投稿" 
            className={styles.titleInput} 
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            required
          />
          
          <input 
            type="text" 
            placeholder="サブタイトル（記事の説明）" 
            className={styles.subtitleInput}
            value={formData.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
          />

          <div className={styles.coverUpload}>
            <div className={styles.uploadPlaceholder}>
              <ImageIcon size={32} />
              <input 
                type="text" 
                placeholder="画像URLを入力" 
                value={formData.coverImage || ''} 
                className={styles.urlInput}
                onChange={(e) => updateField('coverImage', e.target.value)}
              />
            </div>
          </div>

          <textarea 
            className={styles.textArea}
            placeholder="本文をこちらに入力（Markdown形式）"
            value={formData.content || ''}
            onChange={(e) => updateField('content', e.target.value)}
            required
          />
        </div>

        <aside className={styles.editorSettings}>
          <div className={styles.settingsSection}>
            <h4>POST DETAILS</h4>
            <div className={styles.field}>
              <label>カテゴリー</label>
              <div className={styles.selectWrapper}>
                <select 
                   className={styles.selectInput}
                   value={formData.categoryId || ''}
                   onChange={(e) => updateField('categoryId', e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>
            <div className={styles.field}>
              <label>スラッグ</label>
              <input 
                type="text" 
                value={formData.slug || ''} 
                onChange={(e) => updateField('slug', e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label>読了時間</label>
              <input 
                type="text" 
                placeholder="例: 10 min read" 
                value={formData.readingTime || ''} 
                onChange={(e) => updateField('readingTime', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.settingsSection}>
            <h4>PUBLISHING</h4>
            <div className={styles.publishingStatus}>
              <div className={styles.statusItem}>
                <Clock size={16} />
                <span>即時公開</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
