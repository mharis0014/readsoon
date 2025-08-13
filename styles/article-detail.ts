import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import type { ReaderTheme } from '../utils/articleContentHelpers';
import { SCREEN_HEIGHT, spacing, typography } from '../utils/responsive';

// Function to get reader theme colors
export const getReaderThemeColors = (theme: ReaderTheme) => {
    switch (theme) {
        case 'sepia':
            return {
                backgroundColor: '#f4ecd8',
                textColor: '#5b4636',
                mutedColor: '#7b6551',
                borderColor: '#dccfb8',
                headerBackground: '#f4ecd8',
                selectionBackground: '#d4a574',
                selectionText: '#5b4636',
                highlightButtonBackground: '#8b4513',
                highlightButtonText: '#ffffff',
                savedHighlightBackground: '#ffe8a3',
            };
        case 'dark':
            return {
                backgroundColor: '#0f172a',
                textColor: '#e5e7eb',
                mutedColor: '#94a3b8',
                borderColor: '#334155',
                headerBackground: '#0f172a',
                selectionBackground: '#3b82f6',
                selectionText: '#ffffff',
                highlightButtonBackground: '#1e40af',
                highlightButtonText: '#ffffff',
                savedHighlightBackground: '#fbbf24',
            };
        default: // light
            return {
                backgroundColor: '#ffffff',
                textColor: '#111827',
                mutedColor: '#6b7280',
                borderColor: '#e5e7eb',
                headerBackground: '#ffffff',
                selectionBackground: '#60a5fa',
                selectionText: '#ffffff',
                highlightButtonBackground: '#3b82f6',
                highlightButtonText: '#ffffff',
                savedHighlightBackground: '#fff59d',
            };
    }
};

export const articleDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        position: 'relative',
    },

    // Error State
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    errorText: {
        fontSize: typography.lg,
        color: Colors.gray,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    errorSubtext: {
        fontSize: typography.md,
        color: Colors.gray,
        marginBottom: spacing.lg,
        textAlign: 'center',
        opacity: 0.7,
    },
    errorButton: {
        backgroundColor: Colors.red,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: spacing.sm,
    },
    errorButtonText: {
        color: Colors.white,
        fontSize: typography.md,
        fontWeight: '600',
    },

    // Hero Section
    heroContainer: {
        height: SCREEN_HEIGHT * 0.4,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderBottomLeftRadius: spacing.md,
        borderBottomRightRadius: spacing.md,
    },
    heroOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.lg,
        paddingBottom: spacing.xl,
    },
    categoryTag: {
        backgroundColor: 'rgba(255, 255, 255, 0.38)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: spacing.sm,
        alignSelf: 'flex-start',
        marginBottom: spacing.md,
        color: Colors.black,
        fontSize: typography.sm,
        fontWeight: '600',
    },
    heroTitle: {
        color: Colors.white,
        fontSize: typography.xxxl,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        lineHeight: typography.xxl * 1.2,
    },

    // Header Navigation
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    headerContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonIcon: {
        width: 24,
        height: 24,
        tintColor: Colors.white,
    },
    headerActions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonIcon: {
        width: 24,
        height: 24,
        tintColor: Colors.white,
    },

    // Content Section
    contentContainer: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    // Profile Section
    profileSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        backgroundColor: Colors.white,
        minHeight: 80,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
        marginRight: spacing.md,
    },
    profileImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: spacing.md,
    },
    profileText: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    authorName: {
        fontSize: typography.md,
        fontWeight: '600',
        color: Colors.black,
        marginBottom: spacing.xs,
    },
    publishDate: {
        fontSize: typography.sm,
        color: Colors.gray,
    },
    metaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
        flexWrap: 'wrap',
        marginRight: spacing.md,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing.md,
        marginTop: spacing.xs,
        backgroundColor: 'rgba(229, 231, 235, 0.5)',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.sm,
    },
    readingTime: {
        fontSize: typography.sm,
        color: Colors.gray,
        marginLeft: spacing.xs,
        fontWeight: '500',
    },
    wordCount: {
        fontSize: typography.sm,
        color: Colors.gray,
        marginLeft: spacing.xs,
        fontWeight: '500',
    },
    bookmarkButton: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: Colors.red,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookmarkButtonActive: {
        backgroundColor: Colors.red,
    },
    bookmarkIcon: {
        fontSize: typography.md,
    },

    // Article Content
    articleContent: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        backgroundColor: Colors.white,
    },
    articleTitle: {
        fontSize: typography.xl,
        fontWeight: 'bold',
        color: Colors.black,
        lineHeight: typography.xl * 1.3,
        marginBottom: spacing.lg,
    },
    articleBody: {
        fontSize: typography.md,
        color: Colors.black,
        lineHeight: typography.md * 1.5,
    },
    noContentContainer: {
        padding: spacing.lg,
        alignItems: 'center',
    },
    noContentText: {
        fontSize: typography.lg,
        color: Colors.gray,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    noContentSubtext: {
        fontSize: typography.md,
        color: Colors.gray,
        textAlign: 'center',
        opacity: 0.7,
    },

    // Bottom Navigation
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.lightGray,
        position: 'relative',
        zIndex: 10,
    },
    navButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    navButtonText: {
        fontSize: typography.xl,
        color: Colors.gray,
    },
    navButtonIcon: {
        width: typography.xxxl,
        height: typography.xxxl,
    },

    // TTS Loading State
    ttsLoadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(229, 231, 235, 0.5)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: spacing.md,
        flex: 1,
    },
    ttsLoadingText: {
        fontSize: typography.sm,
        color: Colors.gray,
        marginLeft: spacing.sm,
    },

    // TTS Controls
    ttsControlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
        flex: 1,
        gap: spacing.xl,
    },
    ttsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: spacing.sm,
        minWidth: 80,
        justifyContent: 'center',
    },
    ttsButtonText: {
        fontSize: typography.sm,
        color: Colors.white,
        fontWeight: '600',
        marginLeft: spacing.xs,
    },
    bookmarkedText: {
        color: Colors.red,
    },
    contentText: {
        fontSize: typography.md,
        color: Colors.black,
        lineHeight: typography.md * 1.5,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
    },
    titleSection: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
    },
    category: {
        fontSize: typography.sm,
        color: Colors.white,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.xs,
        alignSelf: 'flex-start',
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: typography.xl,
        fontWeight: 'bold',
        color: Colors.white,
        lineHeight: typography.xl * 1.3,
    },

    // List styles for RenderHTML
    li: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
        paddingLeft: 12,
        paddingRight: 8
    },
    ul: {
        marginBottom: 20,
        paddingLeft: 20,
        marginTop: 8
    },
    ol: {
        marginBottom: 20,
        paddingLeft: 20,
        // listStyleType: 'decimal',
        marginTop: 8
    },

    // Reading Mode Styles
    readingModeContainer: {
        flex: 1,
        paddingTop: 60,
    },
    readingModeHeader: {
        borderBottomWidth: 1,
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        position: 'relative',
    },
    readingModeBackButton: {
        position: 'absolute',
        top: 16,
        right: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
    },
    readingModeBackButtonText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#374151',
    },
    readerControlsToolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    themeControls: {
        flexDirection: 'row',
        gap: 6,
        paddingLeft: 16,
    },
    themeButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 0,
    },
    themeButtonActive: {
        backgroundColor: '#7c3aed',
        borderColor: '#7c3aed',
        shadowColor: '#7c3aed',
        shadowOpacity: 0.2,
        elevation: 2,
    },
    themeButtonInactive: {
        backgroundColor: '#ffffff',
        borderColor: '#d1d5db',
        shadowColor: 'transparent',
        shadowOpacity: 0,
    },
    themeButtonText: {
        fontWeight: '600',
        fontSize: 13,
        textTransform: 'capitalize',
    },
    themeButtonTextActive: {
        color: '#ffffff',
    },
    themeButtonTextInactive: {
        color: '#374151',
    },
    fontSizeControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#d1d5db',
        marginRight: 16,
    },
    fontSizeButton: {
        width: 28,
        height: 28,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
    },
    fontSizeButtonText: {
        fontSize: 16,
        fontWeight: '700',
    },
    fontSizeButtonTextEnabled: {
        color: '#374151',
    },
    fontSizeButtonTextDisabled: {
        color: '#9ca3af',
    },
    fontSizeText: {
        minWidth: 36,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginHorizontal: 8,
    },
    readingHint: {
        backgroundColor: '#fef3c7',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fde68a',
        marginTop: spacing.smd,
        width: '77%',
    },
    readingHintText: {
        fontSize: 11,
        color: '#92400e',
        fontWeight: '500',
    },
    readingModeContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        paddingVertical: 24,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    webViewContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },

}); 