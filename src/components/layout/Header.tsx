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
    </header>
  );
}
