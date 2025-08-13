import { supabase } from '../lib/supabase';
import { Article } from '../types/article';
import type { Database } from '../types/supabase';

type LinkRow = Database['public']['Tables']['links']['Row'];
type LinkInsert = Database['public']['Tables']['links']['Insert'];
type LinkUpdate = Database['public']['Tables']['links']['Update'];

export class ArticleService {
    /**
     * Get all articles for a user
     */
    static async getUserArticles(userId: string): Promise<Article[]> {

        const { data, error } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(this.mapLinkToArticle);
    }

    /**
     * Get a single article by ID
     */
    static async getArticle(articleId: string): Promise<Article | null> {
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .eq('id', articleId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No rows returned
            throw error;
        }

        return this.mapLinkToArticle(data);
    }

    /**
     * Save a new article with full extracted data (works with both user types)
     */
    static async saveArticle(
        userId: string,
        articleData: Omit<Article, 'id' | 'savedAt' | 'isSaved'>,
        customTitle?: string
    ): Promise<Article> {
        const isAlreadySaved = await this.isUrlSaved(userId, articleData.url);
        if (isAlreadySaved) {
            throw new Error('Article already saved');
        }

        const linkData: LinkInsert = {
            user_id: userId,
            url: articleData.url,
            title: customTitle || articleData.title,
            description: articleData.description,
            image_url: typeof articleData.imageUrl === 'string' ? articleData.imageUrl : null,
            note: articleData.content, // Store full content in the note field
            html_content: articleData.htmlContent, // Store HTML content
            tags: [], // Empty tags array for now
            favorite: false,
            status: 'saved'
        };

        const { data, error } = await supabase
            .from('links')
            .insert(linkData)
            .select()
            .single();

        if (error) throw error;

        return this.mapLinkToArticle(data);
    }

    /**
     * Save extracted link data directly from API response
     * This method is called automatically when links are extracted
     */
    static async saveExtractedLink(userId: string, url: string, extractedData: {
        title?: string;
        description?: string;
        text?: string;
        image?: string;
        images?: string[];
    }): Promise<Article> {
        // Check if URL is already saved
        const isAlreadySaved = await this.isUrlSaved(userId, url);
        if (isAlreadySaved) {
            throw new Error('Article already saved');
        }

        const linkData: LinkInsert = {
            user_id: userId,
            url: url,
            title: extractedData.title || 'Untitled Article',
            description: extractedData.description || extractedData.text?.substring(0, 150) + '...' || 'No description available',
            image_url: extractedData.image || extractedData.images?.[0] || null,
            note: extractedData.text || '', // Store full content
            html_content: null, // Will be populated when HTML content is available
            tags: [],
            favorite: false,
            status: 'saved'
        };

        const { data, error } = await supabase
            .from('links')
            .insert(linkData)
            .select()
            .single();

        if (error) throw error;

        return this.mapLinkToArticle(data);
    }

    /**
     * Remove an article
     */
    static async removeArticle(articleId: string): Promise<void> {
        const { error } = await supabase
            .from('links')
            .delete()
            .eq('id', articleId);

        if (error) throw error;
    }

    /**
     * Toggle favorite status of an article
     */
    static async toggleFavorite(articleId: string): Promise<Article> {
        // First get the current favorite status
        const { data: currentLink, error: fetchError } = await supabase
            .from('links')
            .select('favorite')
            .eq('id', articleId)
            .single();

        if (fetchError) throw fetchError;

        // Toggle the favorite status
        const { data, error } = await supabase
            .from('links')
            .update({ favorite: !currentLink.favorite })
            .eq('id', articleId)
            .select()
            .single();

        if (error) throw error;

        return this.mapLinkToArticle(data);
    }

    /**
     * Update an article
     */
    static async updateArticle(articleId: string, updates: Partial<LinkUpdate>): Promise<Article> {
        const { data, error } = await supabase
            .from('links')
            .update(updates)
            .eq('id', articleId)
            .select()
            .single();

        if (error) throw error;

        return this.mapLinkToArticle(data);
    }

    /**
     * Check if a URL is already saved by the user
     */
    static async isUrlSaved(userId: string, url: string): Promise<boolean> {

        const { data, error } = await supabase
            .from('links')
            .select('id')
            .eq('user_id', userId)
            .eq('url', url)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
            throw error;
        }

        return !!data;
    }

    /**
     * Search articles by title, description, or content
     */
    static async searchArticles(userId: string, query: string): Promise<Article[]> {
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', userId)
            .or(`title.ilike.%${query}%,description.ilike.%${query}%,note.ilike.%${query}%`)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(this.mapLinkToArticle);
    }

    /**
     * Get filtered articles with various filters
     */
    static async getFilteredArticles(
        userId: string,
        filters: {
            dateRange?: 'all' | 'today' | 'week' | 'month' | 'year';
            sources?: string[];
            readingTime?: 'all' | 'quick' | 'medium' | 'long';
            tags?: string[];
            favoritesOnly?: boolean;
            hasContent?: boolean;
        }
    ): Promise<Article[]> {
        let query = supabase
            .from('links')
            .select('*')
            .eq('user_id', userId);

        // Apply date range filter
        if (filters.dateRange && filters.dateRange !== 'all') {
            const now = new Date();
            let startDate: Date;

            switch (filters.dateRange) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                case 'year':
                    startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startDate = new Date(0);
            }

            query = query.gte('created_at', startDate.toISOString());
        }

        // Apply source filter
        if (filters.sources && filters.sources.length > 0) {
            // Note: This is a simplified approach. In a real implementation,
            // you might want to store domain separately or use a more sophisticated approach
            const sourceConditions = filters.sources.map(source =>
                `url.ilike.%${source}%`
            ).join(',');
            query = query.or(sourceConditions);
        }

        // Apply favorites filter
        if (filters.favoritesOnly) {
            query = query.eq('favorite', true);
        }

        // Apply has content filter
        if (filters.hasContent) {
            query = query.not('note', 'is', null);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;

        let articles = (data || []).map(this.mapLinkToArticle);

        // Apply reading time filter (client-side since it's calculated)
        if (filters.readingTime && filters.readingTime !== 'all') {
            articles = articles.filter(article => {
                switch (filters.readingTime) {
                    case 'quick':
                        return article.readingTime < 5;
                    case 'medium':
                        return article.readingTime >= 5 && article.readingTime <= 15;
                    case 'long':
                        return article.readingTime > 15;
                    default:
                        return true;
                }
            });
        }

        // Apply tags filter (client-side since tags are stored in content)
        if (filters.tags && filters.tags.length > 0) {
            articles = articles.filter(article => {
                const content = `${article.title} ${article.description} ${article.content}`.toLowerCase();
                return filters.tags!.some(tag => content.includes(tag.toLowerCase()));
            });
        }

        return articles;
    }

    /**
     * Map database link row to Article type
     */
    private static mapLinkToArticle(link: LinkRow): Article {
        return {
            id: link.id,
            title: link.title || 'Untitled Article',
            description: link.description || '',
            content: link.note || '', // Map note field to content
            htmlContent: link.html_content || undefined, // Map html_content field to htmlContent
            imageUrl: link.image_url || require('../assets/images/article-placeholder.jpg'),
            url: link.url,
            savedAt: link.created_at,
            readingTime: 5, // Default reading time since it's not stored
            source: link.url.split('//')[1]?.split('/')[0] || 'Unknown Source',
            isSaved: true, // If it's in the database, it's saved
        };
    }
}

export function fetchArticleById(id: string): any {
    throw new Error('Function not implemented.');
}
