'use client';

import { useActionState } from 'react';
import { memberLogin } from '@/app/actions/member-auth';
import styles from './page.module.css';
import { LogIn, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const [state, action, isPending] = useActionState(memberLogin, undefined);

  return (
    <form action={action} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoFocus
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
          placeholder="パスワードを入力"
          className={styles.input}
        />
      </div>
      {state?.error && (
        <p className={styles.error}>{state.error}</p>
      )}
      <button type="submit" className={styles.submitBtn} disabled={isPending}>
        {isPending ? <Loader2 className={styles.spin} size={20} /> : (
          <>
            <LogIn size={20} />
            <span>ログイン</span>
          </>
        )}
      </button>
      <div className={styles.switchAuth}>
        <p>アカウントをお持ちでないですか？ <a href="/register">新規登録</a></p>
      </div>
    </form>
  );
}
