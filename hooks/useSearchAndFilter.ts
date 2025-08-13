import { useCallback, useEffect, useMemo, useState } from 'react';
import { Article } from '../types/article';
import { StorageHelpers } from '../utils/secureStorage';

const MAX_SEARCH_HISTORY = 10;

export function useSearchAndFilter(articles: Article[]) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    useEffect(() => {
        loadSearchHistory();
    }, []);

    const loadSearchHistory = async () => {
        try {
            const history = await StorageHelpers.getSearchHistory();
            if (history) {
                setSearchHistory(history);
            }
        } catch (error) {
            console.error('Failed to load search history:', error);
        }
    };

    const saveSearchHistory = async (history: string[]) => {
        try {
            await StorageHelpers.setSearchHistory(history);
        } catch (error) {
            console.error('Failed to save search history:', error);
        }
    };

    const addToSearchHistory = useCallback((query: string) => {
        if (!query.trim()) return;

        const trimmedQuery = query.trim();
        setSearchHistory(prev => {
            const newHistory = [
                trimmedQuery,
                ...prev.filter(item => item !== trimmedQuery)
            ].slice(0, MAX_SEARCH_HISTORY);

            saveSearchHistory(newHistory);
            return newHistory;
        });
    }, []);

    const clearSearchHistory = useCallback(async () => {
        setSearchHistory([]);
        try {
            await StorageHelpers.clearSearchHistory();
        } catch (error) {
            console.error('Failed to clear search history:', error);
        }
    }, []);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
            addToSearchHistory(query);
        }
    }, [addToSearchHistory]);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
    }, []);

    // Filter articles based on search query only
    const filteredArticles = useMemo(() => {
        if (!searchQuery.trim()) {
            return articles;
        }

        const query = searchQuery.toLowerCase();
        return articles.filter(article =>
            article.title.toLowerCase().includes(query) ||
            article.description.toLowerCase().includes(query) ||
            article.source.toLowerCase().includes(query) ||
            article.content.toLowerCase().includes(query)
        );
    }, [articles, searchQuery]);

    return {
        // State
        searchQuery,
        searchHistory,
        filteredArticles,

        // Actions
        handleSearch,
        clearSearch,
        addToSearchHistory,
        clearSearchHistory,
    };
} 