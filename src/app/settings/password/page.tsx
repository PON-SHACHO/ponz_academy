'use client';

import { useState } from 'react';
import { changePassword } from '@/app/actions/user-actions';
import { Loader2, ShieldCheck, Key, AlertCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function PasswordSettingsPage() {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setMessage({ type: 'error', text: '新しいパスワードが一致しません。' });
      return;
    }
    if (newPass.length < 8) {
      setMessage({ type: 'error', text: '新しいパスワードは8文字以上で設定してください。' });
      return;
    }

    setIsPending(true);
    setMessage(null);
    
    // Modification: Hardcoded 'admin-id' for now, but will eventually be session-based.
    const result = await changePassword('admin-id', currentPass, newPass); 
    
    if (result.success) {
      setMessage({ type: 'success', text: 'パスワードを正常に変更しました。' });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setMessage({ type: 'error', text: result.error || '変更に失敗しました。' });
    }
    setIsPending(false);
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.header}>
        <Link href="/" className={styles.backBtn}>
          <ChevronLeft size={20} />
          <span>Dashboard</span>
        </Link>
        <h1 className={styles.title}>パスワード設定</h1>
        <p className={styles.desc}>安全なパスワードを使用してアカウントを保護してください。</p>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>現在のパスワード</label>
            <input
              type="password"
              required
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          <hr className={styles.divider} />

          <div className={styles.field}>
            <label>新しいパスワード</label>
            <input
              type="password"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="8文字以上"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label>新しいパスワード（確認）</label>
            <input
              type="password"
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="もう一度入力"
              className={styles.input}
            />
          </div>

          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
               {message.type === 'success' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
               <span>{message.text}</span>
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={isPending}>
            {isPending ? <Loader2 className={styles.spin} size={24} /> : (
              <>
                <Key size={18} />
                <span>パスワードを更新する</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
