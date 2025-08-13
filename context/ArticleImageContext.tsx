import React, { createContext, useContext, useState } from 'react';

interface ArticleImageContextType {
    currentImage: any;
    setCurrentImage: (image: any) => void;
}

const ArticleImageContext = createContext<ArticleImageContextType | undefined>(undefined);

export function ArticleImageProvider({ children }: { children: React.ReactNode }) {
    const [currentImage, setCurrentImage] = useState<any>(null);

    return (
        <ArticleImageContext.Provider value={{ currentImage, setCurrentImage }}>
            {children}
        </ArticleImageContext.Provider>
    );
}

export function useArticleImage() {
    const context = useContext(ArticleImageContext);
    if (context === undefined) {
        throw new Error('useArticleImage must be used within an ArticleImageProvider');
    }
    return context;
}
