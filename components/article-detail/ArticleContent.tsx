import type { ReaderTheme } from '@/utils/articleContentHelpers';
import React from 'react';
import { Text, View } from 'react-native';
import { getReaderThemeColors, articleDetailStyles as styles } from '../../styles/article-detail';
import DefaultModeContent from './DefaultModeContent';
import ReadingModeContent from './ReadingModeContent';
import ReadingModeHeader from './ReadingModeHeader';

interface ArticleContentProps {
    content: string;
    title?: string;
    htmlContent?: string;
    articleId?: string;

    // Reader Mode
    isReadingMode?: boolean;
    readerTheme?: ReaderTheme;
    fontSizePx?: number;
    onChangeTheme?: (t: ReaderTheme) => void;
    onChangeFontSize?: (px: number) => void;
    onBack?: () => void;
}

export default function ArticleContent({
    content,
    title,
    htmlContent,
    articleId,
    isReadingMode = false,
    readerTheme = 'light',
    fontSizePx = 16,
    onChangeTheme,
    onChangeFontSize,
    onBack,
}: ArticleContentProps) {
    // Empty state
    if (!content || content.trim().length === 0) {
        return (
            <View style={styles.noContentContainer}>
                <Text style={styles.noContentText}>No content available</Text>
                <Text style={styles.noContentSubtext}>This article may not have any readable content.</Text>
            </View>
        );
    }

    // ---------------- Reading Mode ----------------
    if (isReadingMode) {
        const themeColors = getReaderThemeColors(readerTheme);
        
        return (
            <View style={[
                styles.readingModeContainer,
                { backgroundColor: themeColors.backgroundColor }
            ]}>
                <ReadingModeHeader
                    title={title}
                    readerTheme={readerTheme}
                    fontSizePx={fontSizePx}
                    onChangeTheme={onChangeTheme}
                    onChangeFontSize={onChangeFontSize}
                />
                <ReadingModeContent
                    content={content}
                    title={title}
                    htmlContent={htmlContent}
                    articleId={articleId}
                    readerTheme={readerTheme}
                    fontSizePx={fontSizePx}
                />
            </View>
        );
    }

    // ---------------- Default Mode ----------------
    return (
        <View style={styles.articleContent}>
            <DefaultModeContent
                content={content}
                htmlContent={htmlContent}
            />
        </View>
    );
}