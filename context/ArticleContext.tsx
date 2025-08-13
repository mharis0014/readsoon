import React, { createContext, useCallback, useContext, useState } from 'react';
import { Article } from '../types/article';

interface ArticleContextType {
    articles: Article[];
    loading: boolean;
    error: string | null;
    fetchArticles: () => Promise<void>;
    addArticle: (article: Article) => void;
    removeArticle: (id: string) => void;
    updateArticle: (id: string, updates: Partial<Article>) => void;
    clearError: () => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const useArticleContext = () => {
    const context = useContext(ArticleContext);
    if (!context) {
        throw new Error('useArticleContext must be used within an ArticleProvider');
    }
    return context;
};

// Alias for backward compatibility
export const useArticles = useArticleContext;

interface ArticleProviderProps {
    children: React.ReactNode;
}

export const ArticleProvider: React.FC<ArticleProviderProps> = ({ children }) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchArticles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // This would typically fetch from your API
            // For now, we'll just simulate a delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setArticles([]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch articles');
        } finally {
            setLoading(false);
        }
    }, []);

    const addArticle = useCallback((article: Article) => {
        setArticles(prev => [article, ...prev]);
    }, []);

    const removeArticle = useCallback((id: string) => {
        setArticles(prev => prev.filter(article => article.id !== id));
    }, []);

    const updateArticle = useCallback((id: string, updates: Partial<Article>) => {
        setArticles(prev => prev.map(article =>
            article.id === id ? { ...article, ...updates } : article
        ));
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: ArticleContextType = {
        articles,
        loading,
        error,
        fetchArticles,
        addArticle,
        removeArticle,
        updateArticle,
        clearError
    };

    return (
        <ArticleContext.Provider value={value}>
            {children}
        </ArticleContext.Provider>
    );
}; 