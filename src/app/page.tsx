import { getPosts, getCategories } from '@/app/actions/post-actions';
import styles from './page.module.css';
import { Bookmark, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function Dashboard({ searchParams }: { searchParams: { category?: string } }) {
  const selectedCategory = searchParams.category || 'すべて';
  
  const [categoriesData, posts] = await Promise.all([
    getCategories(),
    getPosts({ categorySlug: selectedCategory, limit: 10 })
  ]);

  const categoryNames = ['すべて', ...categoriesData.map(c => c.name)];
  
  const featuredArticle = posts.find(p => p.subtitle?.includes('自費診療')) || posts[0];
  const recommendedContent = posts.slice(1, 4);
  const latestArticles = posts;

  if (!posts.length) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.emptyState}>記事が見つかりませんでした。</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>院長のためのクリニカル・キュレーション</h1>
        <p className={styles.subtitle}>2024年のクリニック経営をアップデートする、実力派講師陣による最新ナレッジベース。</p>
      </header>

      <div className={styles.categories}>
        {categoryNames.map((cat) => (
          <Link 
            key={cat} 
            href={`/?category=${cat}`}
            className={`${styles.categoryTag} ${selectedCategory === cat ? styles.active : ''}`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {featuredArticle && (
        <section className={styles.featured}>
          <div className={styles.featuredImageWrapper}>
            <img src={featuredArticle.coverImage || ''} alt={featuredArticle.title} />
          </div>
          <div className={styles.featuredContent}>
            <span className={styles.badge}>{featuredArticle.categoryName}</span>
            <Link href={`/articles/${featuredArticle.slug}`}>
              <h2 className={styles.featuredTitle}>{featuredArticle.title}</h2>
            </Link>
            <p className={styles.featuredSubtitle}>{featuredArticle.subtitle}</p>
            <div className={styles.author}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Expert" alt={featuredArticle.authorName || 'Expert'} />
              <div>
                <span className={styles.authorName}>{featuredArticle.authorName || '佐藤 健一'}</span>
                <span className={styles.authorRole}>経営コンサルタント / 退職歯科医</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={styles.recommendations}>
        <div className={styles.sectionHeading}>
          <h2>あなたへの推奨コンテンツ</h2>
          <Link href="/" className={styles.viewMore}>もっと見る</Link>
        </div>
        <div className={styles.recGrid}>
          {recommendedContent.map((item) => (
            <div key={item.id} className={styles.recCard}>
              <div className={styles.recImage}>
                <img src={item.coverImage || ''} alt={item.title} />
                <span className={styles.catBadgeSmall}>{item.categoryName}</span>
              </div>
              <div className={styles.recContent}>
                <Link href={`/articles/${item.slug}`}>
                  <h3>{item.title}</h3>
                </Link>
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
                <img src={item.coverImage || ''} alt={item.title} />
              </div>
              <div className={styles.latestContent}>
                <div className={styles.itemMeta}>
                  <span className={styles.itemCat}>{item.categoryName}</span>
                  <span className={styles.itemDate}>2時間前</span>
                </div>
                <Link href={`/articles/${item.slug}`}>
                  <h3>{item.title}</h3>
                </Link>
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
