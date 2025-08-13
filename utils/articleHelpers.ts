import { ArticleData } from '../data/home';
import { Article } from '../types/article';

/**
 * Convert Article type to ArticleData type for display
 */
export const convertArticleToDisplayData = (
    article: Article,
    type: string
): ArticleData => {
    return {
        id: article.id,
        title: article.title,
        content: article.content,
        htmlContent: article.htmlContent,
        image: typeof article.imageUrl === 'string' ? { uri: article.imageUrl } : article.imageUrl,
        author: article.source,
        date: formatArticleDate(article.savedAt),
        category: 'Article',
        authorImage: article.authorImage ? { uri: article.authorImage } : undefined,
        isSaved: true
    };
};

/**
 * Format article date for display
 */
export const formatArticleDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown Date';

    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch {
        return 'Unknown Date';
    }
}; 