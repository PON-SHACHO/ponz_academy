'use client';

import { useActionState } from 'react';
import { memberRegister } from '@/app/actions/member-auth';
import styles from '../login/page.module.css';
import { UserPlus, Loader2 } from 'lucide-react';

export default function RegisterForm() {
  const [state, action, isPending] = useActionState(memberRegister, undefined);

  return (
    <form action={action} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="name">お名前</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoFocus
          placeholder="山田 太郎"
          className={styles.input}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="your@example.com"
          className={styles.input}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="password">パスワード</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="6文字以上のパスワード"
          minLength={6}
          className={styles.input}
        />
      </div>
      {state?.error && (
        <p className={styles.error}>{state.error}</p>
      )}
      <button type="submit" className={styles.submitBtn} disabled={isPending}>
        {isPending ? <Loader2 className={styles.spin} size={20} /> : (
          <>
            <UserPlus size={20} />
            <span>登録して始める</span>
          </>
        )}
      </button>
      <div className={styles.switchAuth}>
        <p>既にアカウントをお持ちですか？ <a href="/login">ログイン</a></p>
      </div>
    </form>
  );
}
