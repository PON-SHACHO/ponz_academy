import LoginForm from './LoginForm';
import styles from './page.module.css';

export default function MemberLoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logoMain}>Ponzu Academy</span>
          <span className={styles.logoSub}>受講生ログイン</span>
        </div>
        <p className={styles.intro}>
          サロン経営の未来を切り拓く、実践的な学びの世界へ。
          ログインして講義を再開しましょう。
        </p>
        <LoginForm />
        <div className={styles.footer}>
          <p>ログインでお困りの方は、サポートまでお問い合わせください。</p>
        </div>
      </div>
    </div>
  );
}
