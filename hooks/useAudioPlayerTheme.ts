import { useThemeColor } from './useThemeColor';

/**
 * Hook for audio player screen theme colors
 */
export function useAudioPlayerTheme() {
    const backgroundColor = useThemeColor({ light: '#f8f8f8', dark: '#121212' }, 'background');
    const textColor = useThemeColor({ light: '#333333', dark: '#ffffff' }, 'text');
    const subtitleColor = useThemeColor({ light: '#666666', dark: '#a0a0a0' }, 'text');
    const iconColor = useThemeColor({ light: '#666666', dark: '#cccccc' }, 'text');
    const accentColor = '#0a7ea4';
    const inactiveColor = useThemeColor({ light: '#cccccc', dark: '#555555' }, 'text');

    return {
        backgroundColor,
        textColor,
        subtitleColor,
        iconColor,
        accentColor,
        inactiveColor,
    };
} 