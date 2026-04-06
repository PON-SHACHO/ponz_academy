'use client';

import { useState } from 'react';
import { requestPasswordReset } from '@/app/actions/auth-actions';
import { Loader2, Mail, ChevronLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

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
      <div className="card">
        <CheckCircle2 color="#2A4D4D" size={48} />
        <h1>メールを送信しました</h1>
        <p>パスワード再設定用のリンクを {email} 宛に送信しました。メールボックスを確認してください。</p>
        <Link href="/login" className="backLink">
          <ChevronLeft size={18} />
          <span>ログインに戻る</span>
        </Link>
        <style jsx>{`
          .card { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
          h1 { font-size: 1.5rem; color: #2A4D4D; }
          p { color: #64748b; line-height: 1.6; }
          .backLink { display: flex; align-items: center; gap: 0.5rem; color: #2A4D4D; margin-top: 1rem; font-weight: 500; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="card">
      <h1>パスワードを忘れましたか？</h1>
      <p>ご登録のメールアドレスを入力してください。パスワード再設定用のリンクをお送りします。</p>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label htmlFor="email">メールアドレス</label>
          <div className="inputWrapper">
             <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@example.com"
                className="input"
              />
          </div>
        </div>
        
        {error && <p className="error">{error}</p>}
        
        <button type="submit" className="submitBtn" disabled={isPending}>
          {isPending ? <Loader2 className="spin" size={20} /> : '送信する'}
        </button>
      </form>

      <Link href="/login" className="backLink">
        <ChevronLeft size={18} />
        <span>ログインに戻る</span>
      </Link>

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
        .backLink { display: flex; align-items: center; gap: 0.5rem; color: #64748b; margin-top: 1rem; font-size: 0.9rem; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        :global(.spin) { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
