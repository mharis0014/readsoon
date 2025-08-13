import { useThemeColor } from './useThemeColor';

/**
 * Hook for article detail screen theme colors
 */
export function useArticleDetailTheme() {
    const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#121212' }, 'background');
    const textColor = useThemeColor({ light: '#333333', dark: '#f5f5f5' }, 'text');
    const subtitleColor = useThemeColor({ light: '#666666', dark: '#a0a0a0' }, 'text');
    const iconColor = useThemeColor({ light: '#cccccc', dark: '#666666' }, 'text');
    const accentColor = '#0a7ea4';

    return {
        backgroundColor,
        textColor,
        subtitleColor,
        iconColor,
        accentColor,
    };
} 