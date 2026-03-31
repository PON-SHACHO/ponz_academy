import { recommendedContent, featuredArticle } from '@/lib/mock-data';
import styles from './page.module.css';
import { Clock, Calendar, User, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ArticleDetail({ params }: { params: { id: string } }) {
  // Mock finding article - in real app would use prisma
  const article = featuredArticle; 

  return (
    <article className={styles.articlePage}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn}>
          <ChevronLeft size={20} />
          <span>Dashboard</span>
        </Link>
        <div className={styles.meta}>
          <span className={styles.categoryBadge}>{article.category}</span>
          <span className={styles.readingTime}>{article.readingTime}</span>
        </div>
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.authorSection}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Expert" alt={article.author} className={styles.authorAvatar} />
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{article.author}</span>
            <span className={styles.authorRole}>{article.authorRole}</span>
          </div>
          <div className={styles.date}>
            <Calendar size={16} />
            <span>2024.03.31</span>
          </div>
        </div>
      </header>

      <div className={styles.heroImage}>
        <img src={article.image} alt={article.title} />
      </div>

      <div className={styles.content}>
        <p className={styles.lead}>
          「説明」だけでは不十分です。患者様が本当に求めているのは、専門的な解説ではなく「自分の未来がどう変わるか」という希望です。
        </p>

        <section className={styles.section}>
          <h2>1. 透明性の高いコミュニケーション</h2>
          <p>
            自費診療の提案において、最も重要なのは信頼関係です。多くの院長が陥る罠は、技術的な正論を振りかざしてしまうこと。患者様は「治ること」がゴールではなく、「治った後の生活」を想像したいのです。
          </p>
          <ul>
            <li>専門用語を使わず、中学生でもわかる言葉で解説する</li>
            <li>メリットだけでなく、リスクや限界も正直に伝える</li>
            <li>料金体系を明確にし、追加費用の不安を取り除く</li>
          </ul>
        </section>

        <blockquote className={styles.quote}>
          「最高の治療技術を持っていても、患者様があなたの言葉を信じていなければ、その治療は半分も成功しません。」
        </blockquote>

        <section className={styles.section}>
          <h2>2. 共感を通じた患者体験の設計</h2>
          <p>
            カウンセリングは「説得」の場ではなく「傾聴」の場です。患者様の話を遮らず、まずは思いをすべて吐き出してもらう。その上で、私たちの技術がどのようにその思いに応えられるかを提示します。
          </p>
        </section>
      </div>

      <footer className={styles.footer}>
        <div className={styles.sectionHeading}>
          <h2>おすすめの講義</h2>
          <Link href="/" className={styles.viewMore}>すべて見る</Link>
        </div>
        <div className={styles.recGrid}>
          {recommendedContent.map((item) => (
            <div key={item.id} className={styles.recCard}>
              <div className={styles.recImage}>
                <img src={item.image} alt={item.title} />
              </div>
              <div className={styles.recContent}>
                <span className={styles.smallCat}>{item.category}</span>
                <h3>{item.title}</h3>
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
