import { buildHtml, safeHTML, wrapPlainText, type ReaderTheme } from '@/utils/articleContentHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { getReaderThemeColors, articleDetailStyles as styles } from '../../styles/article-detail';

const STORAGE_PREFIX = 'ARTICLE_HIGHLIGHT_';

interface ReadingModeContentProps {
    content: string;
    title?: string;
    htmlContent?: string;
    articleId?: string;
    readerTheme: ReaderTheme;
    fontSizePx: number;
}

export default function ReadingModeContent({
    content,
    title,
    htmlContent,
    articleId,
    readerTheme,
    fontSizePx,
}: ReadingModeContentProps) {
    const [initialHtml, setInitialHtml] = useState<string | null>(null);
    const webRef = useRef<WebView>(null);

    // Reading-mode base HTML (without image)
    const baseInnerHtml = useMemo(() => {
        const body = htmlContent ? htmlContent : wrapPlainText(content);
        return safeHTML(body);
    }, [content, htmlContent]);

    // Load (or rebuild) HTML when reading settings change
    useEffect(() => {
        let alive = true;

        const load = async () => {
            try {
                const themeColors = getReaderThemeColors(readerTheme);
                
                if (articleId) {
                    const stored = await AsyncStorage.getItem(STORAGE_PREFIX + articleId);
                    if (alive && stored && stored.trim()) {
                        setInitialHtml(
                            buildHtml({ 
                                inner: stored, 
                                theme: readerTheme, 
                                fontSize: fontSizePx, 
                                title,
                                selectionBackground: themeColors.selectionBackground,
                                selectionText: themeColors.selectionText,
                                highlightButtonBackground: themeColors.highlightButtonBackground,
                                highlightButtonText: themeColors.highlightButtonText,
                                savedHighlightBackground: themeColors.savedHighlightBackground
                            })
                        );
                        return;
                    }
                }
            } catch { }
            if (alive) {
                const themeColors = getReaderThemeColors(readerTheme);
                setInitialHtml(
                    buildHtml({ 
                        inner: baseInnerHtml, 
                        theme: readerTheme, 
                        fontSize: fontSizePx, 
                        title,
                        selectionBackground: themeColors.selectionBackground,
                        selectionText: themeColors.selectionText,
                        highlightButtonBackground: themeColors.highlightButtonBackground,
                        highlightButtonText: themeColors.highlightButtonText,
                        savedHighlightBackground: themeColors.savedHighlightBackground
                    })
                );
            }
        };

        load();
        return () => { alive = false; };
    }, [readerTheme, fontSizePx, articleId, baseInnerHtml, title]);

    const onMessage = async (ev: WebViewMessageEvent) => {
        try {
            const data = JSON.parse(ev.nativeEvent.data);
            if (data.type === 'save') {
                if (articleId && typeof data.html === 'string') {
                    await AsyncStorage.setItem(STORAGE_PREFIX + articleId, data.html);
                }
            }
        } catch { }
    };

    return (
        <>
            {/* Content WebView */}
            {!initialHtml ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#7c3aed" />
                </View>
            ) : (
                <View style={styles.readingModeContent}>
                    <WebView
                        ref={webRef}
                        originWhitelist={['*']}
                        showsVerticalScrollIndicator={false}
                        automaticallyAdjustContentInsets
                        setSupportMultipleWindows={false}
                        javaScriptEnabled
                        domStorageEnabled
                        onMessage={onMessage}
                        source={{ html: initialHtml }}
                        style={styles.webViewContainer}
                        dataDetectorTypes={Platform.OS === 'ios' ? ['link'] : 'none'}
                    />
                </View>
            )}
        </>
    );
}
