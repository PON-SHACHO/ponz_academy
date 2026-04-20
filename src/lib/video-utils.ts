import { Post } from '@/types';

/**
 * Extracts YouTube video ID from various URL formats
 */
export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Generates YouTube thumbnail URL
 * mqdefault is medium quality (320x180), which is good for list views
 */
export function getYouTubeThumbnail(videoId: string | null): string {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

/**
 * Master function to get a post's thumbnail.
 * Priority: 1. coverImage, 2. First YouTube video thumbnail, 3. Empty string
 */
export function getPostThumbnail(post: Post): string {
  // 1. If explicit cover image exists, use it
  if (post.coverImage) return post.coverImage;

  // 2. Try to get thumbnail from videoUrls
  const videoUrlRaw = post.videoUrl;
  if (!videoUrlRaw) return '';

  try {
    const parsed = typeof videoUrlRaw === 'string' ? JSON.parse(videoUrlRaw) : videoUrlRaw;
    const items = Array.isArray(parsed) ? parsed : [videoUrlRaw];
    
    for (const item of items) {
      const url = typeof item === 'string' ? item : item.url;
      const videoId = getYouTubeId(url);
      if (videoId) {
        return getYouTubeThumbnail(videoId);
      }
    }
  } catch (e) {
    // Fallback for simple string if JSON parse fails
    if (typeof videoUrlRaw === 'string') {
      const videoId = getYouTubeId(videoUrlRaw);
      if (videoId) return getYouTubeThumbnail(videoId);
    }
  }

  return '';
}
