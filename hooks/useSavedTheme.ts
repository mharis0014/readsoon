import { useThemeColor } from './useThemeColor';

/**
 * Hook for saved articles screen theme colors
 */
export function useSavedTheme() {
    const backgroundColor = useThemeColor({ light: '#f8f8f8', dark: '#121212' }, 'background');
    const textColor = useThemeColor({ light: '#333333', dark: '#f5f5f5' }, 'text');
    const subtitleColor = useThemeColor({ light: '#777', dark: '#9e9e9e' }, 'text');
    const iconColor = useThemeColor({ light: '#cccccc', dark: '#666666' }, 'text');

    return {
        backgroundColor,
        textColor,
        subtitleColor,
        iconColor,
    };
} 