import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { ThemedText } from '../layout/ThemedText';

export type SettingItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
    onPress?: () => void;
    size?: number;
    borderRadius?: number;
    padding?: number;
    fontSize?: number;
};

/**
 * Setting item component for profile settings
 */
export function SettingItem({
    icon,
    title,
    subtitle,
    rightElement,
    onPress,
    size = 38,
    borderRadius = 19,
    padding = 16,
    fontSize = 14
}: SettingItemProps) {
    const cardBg = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
    const accent = useThemeColor({ light: '#0a7ea4', dark: '#2c8cb0' }, 'tint');
    const subtitleColor = useThemeColor({ light: '#666666', dark: '#a0a0a0' }, 'text');

    return (
        <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg, padding, borderRadius }]}
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={[styles.iconContainer, { width: size, height: size, borderRadius: borderRadius }]}>
                <Ionicons name={icon} size={20} color={accent} />
            </View>

            <View style={styles.settingContent}>
                <ThemedText style={[styles.settingTitle, { fontSize }]}>{title}</ThemedText>
                {!!subtitle && (
                    <ThemedText style={[styles.settingSubtitle, { color: subtitleColor, fontSize: fontSize - 2 }]}>
                        {subtitle}
                    </ThemedText>
                )}
            </View>

            {rightElement ?? <Ionicons name="chevron-forward" size={18} color={subtitleColor} />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontWeight: '500',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 12,
    },
}); 