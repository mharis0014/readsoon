import React, { createContext, useCallback, useContext, useState } from 'react';
import { Article } from '../types/article';

interface TopPicksContextType {
    topPicks: Article[];
    addToTopPicks: (article: Article) => void;
    removeFromTopPicks: (id: string) => void;
    clearTopPicks: () => void;
}

const TopPicksContext = createContext<TopPicksContextType | undefined>(undefined);

export const useTopPicks = () => {
    const context = useContext(TopPicksContext);
    if (!context) {
        throw new Error('useTopPicks must be used within a TopPicksProvider');
    }
    return context;
};

interface TopPicksProviderProps {
    children: React.ReactNode;
}

export const TopPicksProvider: React.FC<TopPicksProviderProps> = ({ children }) => {
    const [topPicks, setTopPicks] = useState<Article[]>([]);

    const addToTopPicks = useCallback((article: Article) => {
        setTopPicks(prev => {
            // Check if article already exists
            const exists = prev.some(existing => existing.id === article.id);
            if (exists) return prev;

            // Add to beginning of array
            return [article, ...prev];
        });
    }, []);

    const removeFromTopPicks = useCallback((id: string) => {
        setTopPicks(prev => prev.filter(article => article.id !== id));
    }, []);

    const clearTopPicks = useCallback(() => {
        setTopPicks([]);
    }, []);

    const value: TopPicksContextType = {
        topPicks,
        addToTopPicks,
        removeFromTopPicks,
        clearTopPicks
    };

    return (
        <TopPicksContext.Provider value={value}>
            {children}
        </TopPicksContext.Provider>
    );
}; 