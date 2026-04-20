'use client';

import { useState, useEffect } from 'react';
import { savePost } from '@/app/actions/post-actions';
import { Post, Category } from '@/types';
import styles from '@/app/admin/editor/page.module.css';
import { Eye, Video, ChevronDown, Clock, Loader2, Save, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VideoEditorProps {
  initialPost?: Post | null;
  categories: Category[];
}

function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function VideoEditor({ initialPost, categories }: VideoEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  
  // Find "動画" category ID
  const videoCategory = categories.find(c => c.name === '動画' || c.slug === 'video');
  const defaultCategoryId = videoCategory?.id || (categories.length > 0 ? categories[0].id : '');

  // Initialize videoUrl as an array of VideoSection objects
  const initialVideoSections = initialPost?.videoUrl 
    ? (typeof initialPost.videoUrl === 'string' 
        ? (() => {
            try {
              const parsed = JSON.parse(initialPost.videoUrl);
              return Array.isArray(parsed) 
                ? parsed.map(item => {
                    if (typeof item === 'string') return { title: '', url: item, content: '' };
                    return { title: item.title || '', url: item.url || '', content: item.content || '' };
                  })
                : [{ title: '', url: initialPost.videoUrl, content: '' }];
            } catch {
              return [{ title: '', url: initialPost.videoUrl, content: '' }];
            }
          })()
        : (initialPost.videoUrl as any[]).map(item => {
            if (typeof item === 'string') return { title: '', url: item, content: '' };
            return { title: item.title || '', url: item.url || '', content: item.content || '' };
          }))
    : [{ title: '', url: '', content: '' }];

  const [formData, setFormData] = useState<Partial<Post>>({
    title: initialPost?.title || '',
    slug: initialPost?.slug || '',
    subtitle: initialPost?.subtitle || '',
    content: initialPost?.content || '',
    videoUrl: initialVideoSections,
    categoryId: initialPost?.categoryId || defaultCategoryId,
    published: initialPost?.published ?? true,
    id: initialPost?.id,
  });

  const handleSave = async (published: boolean = true) => {
    setIsSaving(true);
    try {
      // Filter out empty sections (must have either URL, title or content to keep)
      const cleanedSections = (formData.videoUrl as any[]).filter(s => s.url.trim() !== '' || s.content.trim() !== '' || s.title.trim() !== '');
      const dataToSave = { ...formData, videoUrl: cleanedSections, published };
      const result = await savePost(dataToSave);
      if (result.success) {
        router.push('/admin/videos');
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
    
    if (field === 'title' && !initialPost && !formData.slug) {
         let slug = value.toLowerCase()
            .trim()
            .replace(/[\s\t\n]+/g, '-')
            .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');

         if (!slug || slug.length < 2) {
           slug = `video-${Date.now().toString(36)}`;
         }
         
         setFormData(prev => ({ ...prev, [field]: value, slug: slug.slice(0, 100) }));
    }
  };

  const updateSection = (index: number, field: 'url' | 'content' | 'title', value: string) => {
    const newSections = [...(formData.videoUrl as any[])];
    newSections[index] = { ...newSections[index], [field]: value };
    setFormData(prev => ({ ...prev, videoUrl: newSections }));
  };

  const addVideoField = () => {
    setFormData(prev => ({ ...prev, videoUrl: [...(prev.videoUrl as any[]), { title: '', url: '', content: '' }] }));
  };

  const removeVideoField = (index: number) => {
    const newSections = [...(formData.videoUrl as any[])];
    if (newSections.length > 1) {
      newSections.splice(index, 1);
      setFormData(prev => ({ ...prev, videoUrl: newSections }));
    } else {
      newSections[0] = { title: '', url: '', content: '' };
      setFormData(prev => ({ ...prev, videoUrl: newSections }));
    }
  };

  return (
    <div className={styles.editorForm}>
      <header className={styles.editorHeader}>
        <div className={styles.breadCrumbs}>
          <span>Workspace</span>
          <span className={styles.separator}>/</span>
          <span>Videos</span>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>{initialPost ? '編集' : '動画投稿作成'}</span>
        </div>
        <div className={styles.editorActions}>
          <button 
            type="button" 
            className={styles.secondaryBtn}
            onClick={() => handleSave(false)}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className={styles.spin} size={18} /> : <Save size={18} />}
            <span>保存</span>
          </button>
          <button type="button" className={styles.secondaryBtn}>
            <Eye size={18} /> 
            <span>プレビュー</span>
          </button>
          <button 
            type="button" 
            className={styles.primaryBtn} 
            onClick={() => handleSave(true)}
            disabled={isSaving}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Send size={18} />
            <span>{initialPost ? '更新する' : '公開する'}</span>
          </button>
        </div>
      </header>

      <div className={styles.editorContent}>
        <div className={styles.writingArea}>
          <input 
            type="text" 
            placeholder="講義全体のタイトル" 
            className={styles.titleInput} 
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            required
          />
          
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#2D4F4F', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Video size={20} />
              動画と解説セクション
            </h3>
            
            {(formData.videoUrl as any[]).map((section, index) => {
              const videoId = getYouTubeId(section.url);
              return (
                <div key={index} style={{ marginBottom: '2.5rem', padding: '24px', background: '#F8F9FA', borderRadius: '16px', border: '1px solid #E9ECEF', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#2D4F4F', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                          {index + 1}
                        </div>
                        <input 
                          type="text" 
                          placeholder="セクションのタイトル (例: Step 1. 基本設定)" 
                          style={{ flex: 1, border: 'none', borderBottom: '2px solid #E9ECEF', background: 'transparent', outline: 'none', fontSize: '1.1rem', fontWeight: 600, padding: '4px 0' }}
                          value={section.title || ''}
                          onChange={(e) => updateSection(index, 'title', e.target.value)}
                        />
                        <button 
                          type="button" 
                          onClick={() => removeVideoField(index)}
                          style={{ color: '#ef4444', background: '#FEE2E2', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', fontWeight: 'bold', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="このセクションを削除"
                        >
                          ×
                        </button>
                     </div>
                     
                     <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #E9ECEF', padding: '10px 14px', borderRadius: '10px', background: 'white' }}>
                        <Video color="#ef4444" size={20} />
                        <input 
                          type="text" 
                          placeholder="YouTubeのURLを入力" 
                          style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem' }}
                          value={section.url || ''}
                          onChange={(e) => updateSection(index, 'url', e.target.value)}
                        />
                     </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: videoId ? '1fr 1fr' : '1fr', gap: '20px' }}>
                    {videoId && (
                      <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#000', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={`Video ${index + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6C757D' }}>セクションの解説文 (Markdown)</label>
                      <textarea 
                        placeholder="この動画の前後の説明や見出しを入力..." 
                        style={{ width: '100%', flex: 1, minHeight: videoId ? 'auto' : '120px', padding: '12px', border: '1px solid #E9ECEF', borderRadius: '10px', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit' }}
                        value={section.content}
                        onChange={(e) => updateSection(index, 'content', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <button 
              type="button" 
              onClick={addVideoField}
              style={{ width: '100%', padding: '14px', background: '#E8F6F6', color: '#2D4F4F', border: '2px dashed #B8D8D8', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
            >
              + 動画セクションを追加する
            </button>
          </div>

          <div style={{ borderTop: '1px solid #E9ECEF', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#2D4F4F' }}>記事のまとめ・補足</h3>
            <textarea 
              className={styles.textArea}
              placeholder="記事全体のまとめや、追加の補足情報を入力（Markdown形式）"
              value={formData.content || ''}
              onChange={(e) => updateField('content', e.target.value)}
              required
            />
          </div>
        </div>

        <aside className={styles.editorSettings}>
          <div className={styles.settingsSection}>
            <h4>VIDEO DETAILS</h4>
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
    </div>
  );
}
