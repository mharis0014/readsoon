/**
 * Hook to get theme-aware colors
 * @param props - Object with light and dark color values
 * @param colorName - Key from Colors constant
 * @returns The appropriate color for the current theme
 */

import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
    const theme = useColorScheme() ?? 'light';
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
} 