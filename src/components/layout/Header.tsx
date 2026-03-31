import { Search, Bell, Settings } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.searchWrapper}>
        <Search size={18} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search insights..." 
          className={styles.searchInput} 
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.notificationDot} />
        </button>
        <button className={styles.iconBtn}>
          <Settings size={20} />
        </button>
        <div className={styles.avatar}>
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ponz" 
            alt="User Avatar" 
          />
        </div>
      </div>
    </header>
  );
}
