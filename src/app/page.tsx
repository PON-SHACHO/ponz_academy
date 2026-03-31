import { categories, featuredArticle, recommendedContent, latestArticles } from '@/lib/mock-data';
import styles from './page.module.css';
import { Bookmark, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>院長のためのクリニカル・キュレーション</h1>
        <p className={styles.subtitle}>2024年のクリニック経営をアップデートする、実力派講師陣による最新ナレッジベース。</p>
      </header>

      <div className={styles.categories}>
        {categories.map((cat, i) => (
          <button 
            key={cat} 
            className={`${styles.categoryTag} ${i === 0 ? styles.active : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <section className={styles.featured}>
        <div className={styles.featuredImageWrapper}>
          <img src={featuredArticle.image} alt={featuredArticle.title} />
        </div>
        <div className={styles.featuredContent}>
          <span className={styles.badge}>{featuredArticle.category}</span>
          <h2 className={styles.featuredTitle}>{featuredArticle.title}</h2>
          <p className={styles.featuredSubtitle}>{featuredArticle.subtitle}</p>
          <div className={styles.author}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Expert" alt={featuredArticle.author} />
            <div>
              <span className={styles.authorName}>{featuredArticle.author}</span>
              <span className={styles.authorRole}>{featuredArticle.authorRole}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.recommendations}>
        <div className={styles.sectionHeading}>
          <h2>あなたへの推奨コンテンツ</h2>
          <a href="/recommendations" className={styles.viewMore}>もっと見る</a>
        </div>
        <div className={styles.recGrid}>
          {recommendedContent.map((item) => (
            <div key={item.id} className={styles.recCard}>
              <div className={styles.recImage}>
                <img src={item.image} alt={item.title} />
                <span className={styles.catBadgeSmall}>{item.category}</span>
              </div>
              <div className={styles.recContent}>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
                <div className={styles.cardFooter}>
                  <span>{item.readingTime}</span>
                  <Bookmark size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.latest}>
        <div className={styles.sectionHeading}>
          <h2>新着記事</h2>
        </div>
        <div className={styles.latestList}>
          {latestArticles.map((item) => (
            <div key={item.id} className={styles.latestItem}>
              <div className={styles.latestImage}>
                <img src={item.image} alt={item.title} />
              </div>
              <div className={styles.latestContent}>
                <div className={styles.itemMeta}>
                  <span className={styles.itemCat}>{item.category}</span>
                  <span className={styles.itemDate}>{item.date}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
              <ChevronRight className={styles.chevron} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
