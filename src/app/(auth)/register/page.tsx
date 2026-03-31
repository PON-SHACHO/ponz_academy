import RegisterForm from './RegisterForm';
import styles from '../login/page.module.css';

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logoMain}>Ponzu Academy</span>
          <span className={styles.logoSub}>新規受講生登録</span>
        </div>
        <p className={styles.intro}>
          アカデミーへようこそ。
          アカウントを作成して、サロン経営の学びを始めましょう。
        </p>
        <RegisterForm />
        <div className={styles.footer}>
          <p>登録することで、利用規約に同意したことになります。</p>
        </div>
      </div>
    </div>
  );
}
