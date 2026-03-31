import styles from './page.module.css';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  Plus,
  HelpCircle,
  Eye,
  Image as ImageIcon,
  ChevronDown,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import AdminLogoutButton from '@/components/AdminLogoutButton';

export default function AdminEditor() {
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.adminSidebar}>
        <div className={styles.adminLogo}>
          <span className={styles.logoMain}>Ponzu Admin</span>
          <span className={styles.logoSub}>Academy Manager</span>
        </div>

        <nav className={styles.adminNav}>
          <ul className={styles.navList}>
            <li><Link href="/admin"><LayoutDashboard size={20} /><span>Dashboard</span></Link></li>
            <li className={styles.active}><Link href="/admin/posts"><FileText size={20} /><span>Posts</span></Link></li>
            <li><Link href="/admin/members"><Users size={20} /><span>Members</span></Link></li>
            <li><Link href="/admin/analytics"><BarChart3 size={20} /><span>Analytics</span></Link></li>
            <li><Link href="/admin/settings"><Settings size={20} /><span>Settings</span></Link></li>
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.newPostBtn}><Plus size={18} /><span>New Post</span></button>
          <div className={styles.footerLinks}>
            <Link href="/support"><HelpCircle size={18} /><span>Support</span></Link>
            <AdminLogoutButton className={styles.logoutBtn} />
          </div>
        </div>
      </aside>

      <main className={styles.editorMain}>
        <header className={styles.editorHeader}>
          <div className={styles.breadCrumbs}>
            <span>Workspace</span>
            <span className={styles.separator}>/</span>
            <span>Posts</span>
            <span className={styles.separator}>/</span>
            <span className={styles.current}>新規投稿作成</span>
          </div>
          <div className={styles.editorActions}>
            <button className={styles.secondaryBtn}>保存</button>
            <button className={styles.secondaryBtn}><Eye size={18} /> プレビュー</button>
            <button className={styles.primaryBtn}>公開する</button>
          </div>
        </header>

        <div className={styles.editorContent}>
          <div className={styles.writingArea}>
            <input 
              type="text" 
              placeholder="無題の投稿" 
              className={styles.titleInput} 
            />
            
            <div className={styles.coverUpload}>
              <div className={styles.uploadPlaceholder}>
                <ImageIcon size={32} />
                <span>カバー画像を追加</span>
              </div>
            </div>

            <div className={styles.richTextEditor}>
              <p className={styles.placeholderText}>
                本日は、次世代の臨床家が身につけるべき「エディトリアル・シンキング」について解説します。
              </p>
              
              <div className={styles.proTip}>
                <div className={styles.tipIcon}>💡</div>
                <div className={styles.tipContent}>
                  <strong>ProTip: 専門性と温かみの両立</strong>
                  <p>情報の正確さはもちろん、読者との心理的距離を縮めるために、あえて余白（ホワイトスペース）を多用したレイアウトを心がけましょう。</p>
                </div>
              </div>

              <h3>1. 視覚的な権威性を構築する</h3>
              <p>プロフェッショナルなデザインにおいて、境界線（ボーダー）は時にノイズとなります。私たちは背景色の絶妙な変化（トーンシフト）を利用して、セクションの区切りを表現します。これにより、情報の流れがスムーズになり、読者の集中を妨げません。</p>
            </div>
            
            <div className={styles.editorToolbar}>
              <button>B</button>
              <button><i>I</i></button>
              <button>List</button>
              <button>Link</button>
              <button>Image</button>
              <button>Code</button>
            </div>
          </div>

          <aside className={styles.editorSettings}>
            <div className={styles.settingsSection}>
              <h4>POST DETAILS</h4>
              <div className={styles.field}>
                <label>カテゴリー</label>
                <div className={styles.select}>
                  <span>Clinical Excellence</span>
                  <ChevronDown size={16} />
                </div>
              </div>
              <div className={styles.field}>
                <label>スラッグ</label>
                <input type="text" defaultValue="editorial-thinking-for-clinicians" />
              </div>
              <div className={styles.fieldRow}>
                <span>目次を表示</span>
                <div className={styles.toggle} data-active="true"></div>
              </div>
            </div>

            <div className={styles.settingsSection}>
              <h4>PUBLISHING</h4>
              <div className={styles.publishingStatus}>
                <div className={styles.statusItem}>
                  <Clock size={16} />
                  <span>即時公開</span>
                </div>
                <button className={styles.scheduleBtn}>スケジュール設定</button>
              </div>
            </div>

            <button className={styles.deleteBtn}>ゴミ箱へ移動</button>
          </aside>
        </div>
      </main>
    </div>
  );
}
