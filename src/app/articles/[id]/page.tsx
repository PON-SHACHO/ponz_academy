import { getPostByIdOrSlug, getPosts } from '@/app/actions/post-actions';
import styles from './page.module.css';
import { Clock, Calendar, ChevronLeft } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import { getPostThumbnail, getYouTubeId } from '@/lib/video-utils';



export default async function ArticleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const article = await getPostByIdOrSlug(decodedId);
  
  if (!article) {
    notFound();
  }

  const videoUrlsRaw = article.videoUrl;
  const videoSections = await (async () => {
    if (!videoUrlsRaw) return [];
    try {
      const parsed = typeof videoUrlsRaw === 'string' ? JSON.parse(videoUrlsRaw) : videoUrlsRaw;
      const items = Array.isArray(parsed) ? parsed : [videoUrlsRaw];
      
      return Promise.all(items.map(async (item) => {
        const section = typeof item === 'string' ? { url: item, content: '' } : item;
        const videoId = getYouTubeId(section.url);
        const html = section.content ? await marked.parse(section.content) : '';
        return { ...section, videoId, html };
      }));
    } catch {
      const videoId = getYouTubeId(videoUrlsRaw as string);
      return [{ url: videoUrlsRaw as string, content: '', videoId, html: '' }];
    }
  })();

  // Smart Hero Image: If article.coverImage is missing, try to find the first image in markdown
  const imageMatch = article.content.match(/!\[.*?\]\((.*?)\)/);
  const heroImage = article.coverImage || (imageMatch ? imageMatch[1] : '');

  // Deduplication: If the first image was used as the hero, remove it from the body
  let cleanedContent = article.content;
  if (!article.coverImage && imageMatch) {
    cleanedContent = article.content.replace(imageMatch[0], '');
  }

  // Parse markdown content
  const contentHtml = await marked.parse(cleanedContent);
  
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
          <img src={article.authorAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.authorName || 'User'}`} alt={article.authorName || 'User'} className={styles.authorAvatar} />
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{article.authorName || '管理者'}</span>
            {article.authorBio && (
              <span className={styles.authorRole}>{article.authorBio}</span>
            )}
          </div>
          <div className={styles.date}>
            <Calendar size={16} />
            <span>{formatDate(article.createdAt)}</span>
          </div>
        </div>
      </header>
      
      {videoSections.length > 0 && (
        <div className={styles.sectionsWrapper}>
          {videoSections.map((section, index) => (
            <div key={index} className={styles.videoSection}>
              {section.title && (
                <h2 className={styles.sectionTitle}>{section.title}</h2>
              )}
              {section.videoId && (
                <div className={styles.videoContainer}>
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${section.videoId}`}
                    title={section.title || `${article.title} - Video ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              {section.html && (
                <div 
                  className={styles.sectionContent} 
                  dangerouslySetInnerHTML={{ __html: section.html }} 
                />
              )}
            </div>
          ))}
        </div>
      )}

      {heroImage && videoSections.every(s => !s.videoId) && (
        <div className={styles.heroImage}>
          <img src={heroImage} alt={article.title} />
        </div>
      )}

      <div className={styles.content}>
        <p className={styles.lead}>
          {article.subtitle}
        </p>

        <div 
          className={styles.mainText} 
          dangerouslySetInnerHTML={{ __html: contentHtml }} 
        />
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
                <img src={getPostThumbnail(item)} alt={item.title} />
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
