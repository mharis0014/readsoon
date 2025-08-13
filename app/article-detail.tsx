import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Animated, ScrollView, View } from 'react-native';

import ArticleBottomNav from '../components/article-detail/ArticleBottomNav';
import ArticleContent from '../components/article-detail/ArticleContent';
import ArticleDetailHeader from '../components/article-detail/ArticleDetailHeader';
import ArticleErrorState from '../components/article-detail/ArticleErrorState';
import ShareModal from '../components/modals/ShareModal';
import { ARTICLE_CONSTANTS } from '../constants/Article';
import { type ArticleData } from '../data/home';
import { useArticleDetail } from '../hooks/useArticleDetail';
import { useAudioCache } from '../hooks/useAudioCache';
import { ShareService } from '../services/shareService';
import { useArticleImage } from '../context/ArticleImageContext';
import { getReaderThemeColors, articleDetailStyles as styles } from '../styles/article-detail';
import { convertArticleToDisplayData } from '../utils/articleHelpers';

export default function ArticleDetailScreen() {
    const router = useRouter();
    const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
    const scrollY = React.useRef(new Animated.Value(0)).current;
    const { setCurrentImage } = useArticleImage();

    const [readingProgress, setReadingProgress] = React.useState(0);
    const [isReadingMode, setIsReadingMode] = React.useState(false);
    const [readerTheme, setReaderTheme] = React.useState<'light' | 'sepia' | 'dark'>('light');
    const [fontSizePx, setFontSizePx] = React.useState<number>(16);

    const {
        article,
        loading,
        isBookmarked,
        showShareModal,
        handleBookmark,
        handleShare,
        handleShareOption,
        closeShareModal
    } = useArticleDetail({ id, type });

    // Preload audio in background when article loads
    useEffect(() => {
        if (article && article.content) {
            // Start caching audio silently in background
            // This will cache the audio without showing any loading UI
        }
    }, [article]);

    // Silent background audio caching - no loading UI
    useAudioCache(article?.content || '');

    // Set the current article image in context (before early returns)
    React.useEffect(() => {
        if (article && 'image' in article) {
            setCurrentImage((article as any).image);
        }
    }, [article, setCurrentImage]);

    const handleBack = () => router.back();



    const handleOpenInBrowser = async () => {
        if (article) {
            const originalUrl = ShareService.getOriginalUrl(article);
            if (originalUrl) await ShareService.openInBrowser(originalUrl);
        }
    };

    const handleScroll = (event: any) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        if (contentOffset && contentSize && layoutMeasurement) {
            const progress = Math.min((contentOffset.y / (contentSize.height - layoutMeasurement.height)) * 100, 100);
            setReadingProgress(progress || 0);
            scrollY.setValue(contentOffset.y);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <StatusBar style="light" />
                <ArticleErrorState title="Loading..." />
            </View>
        );
    }

    if (!article) {
        return (
            <View style={styles.container}>
                <StatusBar style="light" />
                <ArticleErrorState
                    title="Article not found"
                    subtitle="The article may have been deleted or is no longer available."
                    buttonText="Go Back"
                    onButtonPress={handleBack}
                />
            </View>
        );
    }

    const displayArticle: ArticleData =
        type === 'saved' && article && 'imageUrl' in article
            ? convertArticleToDisplayData(article, type)
            : (article as ArticleData);



    const content = displayArticle.content || '';
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / ARTICLE_CONSTANTS.WORDS_PER_MINUTE);

    return (
        <View style={styles.container}>
            <StatusBar style={readerTheme === 'dark' ? 'light' : 'dark'} />

            {/* Reading Progress Bar - Only show in reading mode */}
            {isReadingMode && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    backgroundColor: getReaderThemeColors(readerTheme).backgroundColor === '#ffffff'
                        ? 'rgba(229, 231, 235, 0.3)'
                        : 'rgba(0, 0, 0, 0.1)',
                    zIndex: 20
                }}>
                    <Animated.View
                        style={{
                            height: '100%',
                            width: `${readingProgress}%`,
                            backgroundColor: '#7c3aed',
                            borderRadius: 2,
                        }}
                    />
                </View>
            )}

            {isReadingMode ? (
                // Reading Mode - Full screen layout
                <View style={[
                    { flex: 1 },
                    { backgroundColor: getReaderThemeColors(readerTheme).backgroundColor }
                ]}>
                    <ArticleContent
                        articleId={id}
                        title={displayArticle.title || 'Untitled'}
                        content={displayArticle.content || ''}
                        htmlContent={displayArticle.htmlContent}
                        isReadingMode={isReadingMode}
                        readerTheme={readerTheme}
                        fontSizePx={fontSizePx}
                        onChangeTheme={setReaderTheme}
                        onChangeFontSize={setFontSizePx}
                        onBack={handleBack}
                    />
                </View>
            ) : (
                // Default Mode - ScrollView layout
                <ScrollView
                    style={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    <ArticleDetailHeader
                        title={displayArticle.title || 'Untitled'}
                        category={displayArticle.category || 'Article'}
                        image={displayArticle.image}
                        author={displayArticle.author || 'Unknown Author'}
                        date={displayArticle.date || 'Unknown Date'}
                        authorImage={displayArticle.authorImage}
                        readingTime={readingTime}
                        wordCount={wordCount}
                        onBack={handleBack}
                        onBookmark={handleBookmark}
                        onShare={handleShare}
                        isBookmarked={isBookmarked}
                    />

                    <ArticleContent
                        articleId={id}
                        title={displayArticle.title || 'Untitled'}
                        content={displayArticle.content || ''}
                        htmlContent={displayArticle.htmlContent}
                        isReadingMode={isReadingMode}
                        readerTheme={readerTheme}
                        fontSizePx={fontSizePx}
                        onChangeTheme={setReaderTheme}
                        onChangeFontSize={setFontSizePx}
                        onBack={handleBack}
                    />
                </ScrollView>
            )}

            <ArticleBottomNav
                onShare={handleShare}
                onOpenInBrowser={handleOpenInBrowser}
                articleContent={displayArticle.content || ''}
                articleTitle={displayArticle.title || 'Untitled'}
                articleSource={displayArticle.author || 'Unknown Author'}
                articleImage={displayArticle.image}
                isReadingMode={isReadingMode}
                onToggleReadingMode={() => setIsReadingMode(v => !v)}
            />

            <ShareModal
                visible={showShareModal}
                onClose={closeShareModal}
                onShareOption={handleShareOption}
            />
        </View>
    );
}
