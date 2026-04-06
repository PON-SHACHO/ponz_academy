'use client';

import { useState } from 'react';
import { requestPasswordReset } from '@/app/actions/auth-actions';
import { Loader2, Mail, ChevronLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import styles from './page.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError('');
    
    const result = await requestPasswordReset(email);
    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || '送信に失敗しました。');
    }
    setIsPending(false);
  };

  if (isSuccess) {
    return (
      <div className={styles.successCard}>
        <CheckCircle2 color="#2A4D4D" size={64} />
        <h1 className={styles.title}>メールを送信しました</h1>
        <p className={styles.description}>
          パスワード再設定用のリンクを <strong>{email}</strong> 宛に送信しました。<br />
          メールボックスを確認してください。
        </p>
        <Link href="/login" className={styles.backLink}>
          <ChevronLeft size={18} />
          <span>ログインに戻る</span>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>パスワードを忘れましたか？</h1>
      <p className={styles.description}>ご登録のメールアドレスを入力してください。パスワード再設定用のリンクをお送りします。</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>メールアドレス</label>
          <div className={styles.inputWrapper}>
             <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@example.com"
                className={styles.input}
              />
          </div>
        </div>
        
        {error && <p className={styles.error}>{error}</p>}
        
        <button type="submit" className={styles.submitBtn} disabled={isPending}>
          {isPending ? <Loader2 className={styles.spin} size={20} /> : '送信する'}
        </button>
      </form>

      <Link href="/login" className={styles.backLink}>
        <ChevronLeft size={18} />
        <span>ログインに戻る</span>
      </Link>
    </div>
  );
}
