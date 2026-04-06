'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, LogOut, Key, User as UserIcon, Clock } from 'lucide-react';
import Link from 'next/link';
import styles from './Header.module.css';
import { Post } from '@/types';
import { getPosts } from '@/app/actions/post-actions';
import MemberLogoutButton from '../MemberLogoutButton';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch recent posts for notifications
    const fetchPosts = async () => {
      const posts = await getPosts({ limit: 5 });
      setRecentPosts(posts);
    };
    fetchPosts();

    // Close dropdowns on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.searchWrapper}>
        <Search size={18} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search insights..." 
          className={styles.searchInput} 
        />
      </div>

      <div className={styles.actions}>
        {/* Notifications */}
        <div className={styles.dropdownContainer} ref={notificationRef}>
          <button 
            className={`${styles.iconBtn} ${showNotifications ? styles.active : ''}`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowSettings(false);
            }}
          >
            <Bell size={20} />
            {recentPosts.length > 0 && <span className={styles.notificationDot} />}
          </button>
          
          {showNotifications && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>新規記事のお知らせ</div>
              <div className={styles.notificationList}>
                {recentPosts.map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/articles/${post.slug}`}
                    className={styles.notificationItem}
                    onClick={() => setShowNotifications(false)}
                  >
                    <div className={styles.postThumb}>
                      <img src={post.coverImage || ''} alt="" />
                    </div>
                    <div className={styles.postInfo}>
                      <span className={styles.postTitle}>{post.title}</span>
                      <div className={styles.postMeta}>
                        <Clock size={12} />
                        <span>{post.readingTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/" className={styles.dropdownFooter} onClick={() => setShowNotifications(false)}>
                すべて見る
              </Link>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className={styles.dropdownContainer} ref={settingsRef}>
          <button 
            className={`${styles.iconBtn} ${showSettings ? styles.active : ''}`}
            onClick={() => {
              setShowSettings(!showSettings);
              setShowNotifications(false);
            }}
          >
            <Settings size={20} />
          </button>
          
          {showSettings && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>アカウント設定</div>
              <div className={styles.menuList}>
                <Link href="/admin/users" className={styles.menuItem} onClick={() => setShowSettings(false)}>
                   <UserIcon size={18} />
                   <span>プロフィール編集</span>
                </Link>
                <Link href="/settings/password" className={styles.menuItem} onClick={() => setShowSettings(false)}>
                   <Key size={18} />
                   <span>パスワード変更</span>
                </Link>
                <div className={styles.menuDivider} />
                <MemberLogoutButton className={styles.menuItem} />
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dropdownContainer {
          position: relative;
        }
        .dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 320px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
          border: 1px solid #f1f5f9;
          overflow: hidden;
          z-index: 50;
          animation: slideUp 0.2s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdownHeader {
          padding: 1rem;
          font-weight: 600;
          font-size: 0.85rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #f1f5f9;
        }
        .notificationList {
          max-height: 400px;
          overflow-y: auto;
        }
        .notificationItem {
          display: flex;
          gap: 1rem;
          padding: 0.75rem 1rem;
          transition: background 0.2s;
          border-bottom: 1px solid #f8fafc;
        }
        .notificationItem:hover {
          background-color: #f8fafc;
        }
        .postThumb {
          width: 60px;
          height: 40px;
          border-radius: 4px;
          overflow: hidden;
          flex-shrink: 0;
          background: #eee;
        }
        .postThumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .postInfo {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .postTitle {
          font-size: 0.9rem;
          font-weight: 500;
          line-height: 1.3;
          color: #1e293b;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .postMeta {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #94a3b8;
        }
        .dropdownFooter {
          display: block;
          padding: 0.75rem;
          text-align: center;
          font-size: 0.85rem;
          font-weight: 500;
          color: #6b46c1;
          background: #f8fafc;
          transition: background 0.2s;
        }
        .dropdownFooter:hover {
          background: #f1f5f9;
        }
        .menuList {
          padding: 0.5rem;
        }
        .menuItem {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 8px;
          color: #475569;
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        .menuItem:hover {
          background-color: #f1f5f9;
          color: #1e293b;
        }
        .menuDivider {
          height: 1px;
          background: #f1f5f9;
          margin: 0.5rem 0.25rem;
        }
      `}</style>
    </header>
  );
}
