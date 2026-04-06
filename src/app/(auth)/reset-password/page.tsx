'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPassword } from '@/app/actions/auth-actions';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

import styles from './page.module.css';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className={styles.centerCard}>
        <AlertCircle color="#e53e3e" size={64} />
        <h1 className={styles.errorTitle}>無効なリクエスト</h1>
        <p className={styles.description}>再設定トークンが見つからないか、リンクが不完全です。</p>
        <Link href="/login" className={styles.backLink}>ログインへ戻る</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }
    if (password.length < 8) {
      setError('パスワードは8文字以上で設定してください。');
      return;
    }

    setIsPending(true);
    setError('');
    
    const result = await resetPassword(token, password);
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } else {
      setError(result.error || '更新に失敗しました。');
    }
    setIsPending(false);
  };

  if (isSuccess) {
    return (
      <div className={styles.centerCard}>
        <ShieldCheck color="#2A4D4D" size={64} />
        <h1 className={styles.title}>更新完了</h1>
        <p className={styles.description}>パスワードを更新しました。3秒後にログイン画面へ移動します。</p>
        <Link href="/login" className={styles.backLink}>すぐに移動する</Link>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>新しいパスワードの設定</h1>
      <p className={styles.description}>セキュリティのため、8文字以上の新しいパスワードを入力してください。</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>新しいパスワード</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8文字以上"
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="confirmPassword" className={styles.label}>パスワードの確認</label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="もう一度入力"
            className={styles.input}
          />
        </div>
        
        {error && <p className={styles.error}>{error}</p>}
        
        <button type="submit" className={styles.submitBtn} disabled={isPending}>
          {isPending ? <Loader2 className={styles.spin} size={20} /> : '更新する'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
