'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPassword } from '@/app/actions/auth-actions';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

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
      <div className="card">
        <AlertCircle color="#e53e3e" size={48} />
        <h1>無効なリクエスト</h1>
        <p>再設定トークンが見つからないか、リンクが不完全です。</p>
        <Link href="/login" className="backLink">ログインへ戻る</Link>
        <style jsx>{`
          .card { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
          h1 { font-size: 1.5rem; color: #e53e3e; }
          p { color: #64748b; }
          .backLink { color: #2A4D4D; font-weight: 600; text-decoration: underline; margin-top: 1rem; }
        `}</style>
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
      <div className="card">
        <ShieldCheck color="#2A4D4D" size={48} />
        <h1>更新完了</h1>
        <p>パスワードを更新しました。3秒後にログイン画面へ移動します。</p>
        <Link href="/login" className="backLink">すぐに移動する</Link>
        <style jsx>{`
          .card { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
          h1 { font-size: 1.5rem; color: #2A4D4D; }
          p { color: #64748b; }
          .backLink { color: #2A4D4D; font-weight: 600; text-decoration: underline; margin-top: 1rem; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="card">
      <h1>新しいパスワードの設定</h1>
      <p>セキュリティのため、8文字以上の新しいパスワードを入力してください。</p>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label htmlFor="password">新しいパスワード</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8文字以上"
            className="input"
          />
        </div>
        <div className="field">
          <label htmlFor="confirmPassword">パスワードの確認</label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="もう一度入力"
            className="input"
          />
        </div>
        
        {error && <p className="error">{error}</p>}
        
        <button type="submit" className="submitBtn" disabled={isPending}>
          {isPending ? <Loader2 className="spin" size={20} /> : '更新する'}
        </button>
      </form>

      <style jsx>{`
        .card { display: flex; flex-direction: column; gap: 1rem; }
        h1 { font-size: 1.5rem; color: #2A4D4D; }
        p { color: #64748b; font-size: 0.95rem; margin-bottom: 1rem; }
        .form { display: flex; flex-direction: column; gap: 1.25rem; }
        .field { display: flex; flex-direction: column; gap: 0.5rem; }
        label { font-size: 0.85rem; font-weight: 600; color: #475569; }
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 1rem;
        }
        .input:focus { outline: none; border-color: #2A4D4D; }
        .submitBtn {
          background: #2A4D4D;
          color: white;
          padding: 0.85rem;
          border-radius: 8px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: background 0.2s;
        }
        .submitBtn:hover { background: #1a3030; }
        .error { color: #e53e3e; font-size: 0.85rem; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        :global(.spin) { animation: spin 1s linear infinite; }
      `}</style>
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
