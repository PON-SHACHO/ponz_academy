import LoginForm from './LoginForm';
import styles from './page.module.css';

export default function AdminLoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logoMain}>Ponzu Admin</span>
          <span className={styles.logoSub}>管理者ログイン</span>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
