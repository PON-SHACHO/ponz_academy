'use client';

import { useActionState } from 'react';
import { adminLogin } from '@/app/actions/admin-auth';
import styles from './page.module.css';

export default function LoginForm() {
  const [state, action, isPending] = useActionState(adminLogin, undefined);

  return (
    <form action={action} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="password">パスワード</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          placeholder="管理者パスワードを入力"
          className={styles.input}
        />
      </div>
      {state?.error && (
        <p className={styles.error}>{state.error}</p>
      )}
      <button type="submit" className={styles.submitBtn} disabled={isPending}>
        {isPending ? 'ログイン中…' : 'ログイン'}
      </button>
      <div className={styles.forgotPassWrapper}>
        <a href="/forgot-password" className={styles.forgotPassLink}>パスワードを忘れた方はこちら</a>
      </div>
    </form>
  );
}
