import { getPostBySlug, getPosts } from '@/app/actions/post-actions';
import styles from './page.module.css';
import { Clock, Calendar, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ArticleDetail({ params }: { params: { id: string } }) {
  const article = await getPostBySlug(params.id);
  
  if (!article) {
    notFound();
  }

  const recommendations = await getPosts({ limit: 3 });

  return (
    <article className={styles.articlePage}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn}>
          <ChevronLeft size={20} />
          <span>Dashboard</span>
        </Link>
        <div className={styles.meta}>
          <span className={styles.categoryBadge}>{article.categoryName}</span>
          <span className={styles.readingTime}>{article.readingTime}</span>
        </div>
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.authorSection}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Expert" alt={article.authorName || 'Expert'} className={styles.authorAvatar} />
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{article.authorName || '佐藤 健一'}</span>
            <span className={styles.authorRole}>経営コンサルタント / 退職歯科医</span>
          </div>
          <div className={styles.date}>
            <Calendar size={16} />
            <span>2024.03.31</span>
          </div>
        </div>
      </header>

      <div className={styles.heroImage}>
        <img src={article.coverImage || ''} alt={article.title} />
      </div>

      <div className={styles.content}>
        <p className={styles.lead}>
          {article.subtitle}
        </p>

        <div className={styles.mainText} dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
      </div>

      <footer className={styles.footer}>
        <div className={styles.sectionHeading}>
          <h2>おすすめの講義</h2>
          <Link href="/" className={styles.viewMore}>すべて見る</Link>
        </div>
        <div className={styles.recGrid}>
          {recommendations.map((item) => (
            <div key={item.id} className={styles.recCard}>
              <div className={styles.recImage}>
                <img src={item.coverImage || ''} alt={item.title} />
              </div>
              <div className={styles.recContent}>
                <span className={styles.smallCat}>{item.categoryName}</span>
                <Link href={`/articles/${item.slug}`}>
                  <h3>{item.title}</h3>
                </Link>
                <div className={styles.smallMeta}>
                  <Clock size={14} />
                  <span>{item.readingTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </footer>
    </article>
  );
}
