import { getUsers } from '@/app/actions/user-actions';
import AdminTabs from '@/components/admin/AdminTabs';
import UserTable from './UserTable';
import styles from './page.module.css';
import { ShieldCheck, Users } from 'lucide-react';

export default async function UserManagementPage() {
  const users = await getUsers();

  return (
    <div className={styles.adminContainer}>
      <AdminTabs />
      
      <div className={styles.headerWrapper}>
        <div className={styles.headerContent}>
          <div className={styles.consoleLabel}>
            <ShieldCheck size={16} className={styles.shieldIcon} />
            <span>ADMINISTRATIVE CONSOLE</span>
          </div>
          
          <h1 className={styles.pageTitle}>
            <Users size={32} className={styles.titleIcon} strokeWidth={2.5} />
            User Management
          </h1>
          
          <p className={styles.description}>
            プラットフォーム上の全ユーザーを管理します。権限の変更やアカウントの状態を監視し、システムの整合性を維持します。このページは管理者専用であり、一般のナビゲーションからは隠蔽されています。
          </p>
        </div>

        <div className={styles.statsCard}>
          <span className={styles.statsLabel}>ACTIVE USERS</span>
          <div className={styles.statsValue}>
            <Users size={24} className={styles.statsIcon} />
            Global Audience
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <UserTable initialUsers={users} />
      </div>
    </div>
  );
}
