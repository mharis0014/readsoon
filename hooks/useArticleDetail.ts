import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useTopPicks } from '../context/TopPicksContext';
import { mockStaffPicks, type ArticleData } from '../data/home';
import { ArticleService } from '../services/articleService';
import { ShareService } from '../services/shareService';
import { Article } from '../types/article';

interface UseArticleDetailProps {
    id: string;
    type: string;
}

export function useArticleDetail({ id, type }: UseArticleDetailProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [savedArticle, setSavedArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(false);
    const { topPicks } = useTopPicks();

    const fetchSavedArticle = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        try {
            const article = await ArticleService.getArticle(id);
            setSavedArticle(article);
        } catch (error) {
            console.error('Error fetching saved article:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (type === 'saved' && id) {
            fetchSavedArticle();
        }
    }, [type, id, fetchSavedArticle]);

    const getArticle = useCallback((): ArticleData | Article | null => {
        if (type === 'saved') {
            return savedArticle;
        } else if (type === 'top-pick') {
            return topPicks.find(article => article.id === id) || null;
        } else if (type === 'staff-pick') {
            return mockStaffPicks.find(article => article.id === id) || null;
        }
        return null;
    }, [type, id, savedArticle, topPicks]);

    const handleBookmark = useCallback(() => {
        setIsBookmarked(!isBookmarked);
    }, [isBookmarked]);

    const handleShare = useCallback(() => {
        setShowShareModal(true);
    }, []);

    const handleShareOption = useCallback(async (option: string) => {
        const article = getArticle();

        if (!article) {
            Alert.alert('Error', 'Article not found');
            return;
        }

        const originalUrl = ShareService.getOriginalUrl(article);

        if (!originalUrl && ['share-link', 'copy-link', 'open-browser', 'tweet'].includes(option)) {
            Alert.alert(
                'No URL Available',
                'This article does not have an original URL to share.',
                [{ text: 'OK', style: 'default' }]
            );
            return;
        }

        try {
            switch (option) {
                case 'share-link':
                    if (originalUrl) {
                        await ShareService.shareOriginalLink(
                            originalUrl,
                            article.title || 'Article'
                        );
                    }
                    break;

                case 'copy-link':
                    if (originalUrl) {
                        await ShareService.copyOriginalLink(originalUrl);
                    }
                    break;

                case 'open-browser':
                    if (originalUrl) {
                        await ShareService.openInBrowser(originalUrl);
                    }
                    break;

                case 'tweet':
                    if (originalUrl) {
                        await ShareService.shareOnTwitter(
                            originalUrl,
                            article.title || 'Check out this article'
                        );
                    }
                    break;

                case 'print':
                    await ShareService.printArticle();
                    break;

                case 'export-pdf':
                    await ShareService.exportAsPDF();
                    break;

                default:
                    console.log('Unknown share option:', option);
            }
        } catch (error) {
            console.error('Share operation failed:', error);
            Alert.alert(
                'Share Failed',
                'Unable to complete the share operation. Please try again.',
                [{ text: 'OK', style: 'default' }]
            );
        }
    }, [getArticle]);

    const closeShareModal = useCallback(() => {
        setShowShareModal(false);
    }, []);

    return {
        article: getArticle(),
        loading,
        isBookmarked,
        showShareModal,
        handleBookmark,
        handleShare,
        handleShareOption,
        closeShareModal,
        fetchSavedArticle
    };
} 