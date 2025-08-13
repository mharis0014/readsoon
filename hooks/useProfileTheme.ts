import { useThemeColor } from './useThemeColor';

/**
 * Hook for profile screen theme colors
 */
export function useProfileTheme() {
    const backgroundColor = useThemeColor({ light: '#f8f8f8', dark: '#121212' }, 'background');
    const cardBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
    const textColor = useThemeColor({ light: '#333333', dark: '#f5f5f5' }, 'text');
    const subtitleColor = useThemeColor({ light: '#666666', dark: '#a0a0a0' }, 'text');
    const accentColor = useThemeColor({ light: '#0a7ea4', dark: '#2c8cb0' }, 'tint');

    return {
        backgroundColor,
        cardBackgroundColor,
        textColor,
        subtitleColor,
        accentColor,
    };
} 