import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../layout/ThemedText';

interface EmptyStateProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    iconColor?: string;
    textColor: string;
    accentColor?: string;
    size?: 'small' | 'medium' | 'large';
    centered?: boolean;
}

/**
 * Unified empty state component for consistent design across the app
 * Follows DRY principle and provides professional, minimalist design
 */
export function EmptyState({
    icon,
    title,
    description,
    iconColor,
    textColor,
    accentColor = '#007AFF',
    size = 'medium',
    centered = true
}: EmptyStateProps) {
    const iconSizes = {
        small: 32,
        medium: 48,
        large: 64
    };

    const containerSizes = {
        small: 60,
        medium: 80,
        large: 100
    };

    const iconSize = iconSizes[size];
    const containerSize = containerSizes[size];

    return (
        <View style={[
            styles.container,
            centered && styles.centered
        ]}>
            <View style={[
                styles.iconContainer,
                {
                    width: containerSize,
                    height: containerSize,
                    borderRadius: containerSize / 2,
                    backgroundColor: `${accentColor}15` // 15% opacity
                }
            ]}>
                <Ionicons
                    name={icon}
                    size={iconSize}
                    color={iconColor || accentColor}
                />
            </View>

            <View style={styles.textContainer}>
                <ThemedText style={[
                    styles.title,
                    { color: textColor },
                    size === 'small' && styles.titleSmall,
                    size === 'large' && styles.titleLarge
                ]}>
                    {title}
                </ThemedText>
                <ThemedText style={[
                    styles.description,
                    { color: textColor },
                    size === 'small' && styles.descriptionSmall,
                    size === 'large' && styles.descriptionLarge
                ]}>
                    {description}
                </ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 32,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    textContainer: {
        alignItems: 'center',
        maxWidth: 280,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    titleSmall: {
        fontSize: 16,
        marginBottom: 6,
    },
    titleLarge: {
        fontSize: 22,
        marginBottom: 10,
    },
    description: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 20,
        opacity: 0.7,
        letterSpacing: -0.2,
    },
    descriptionSmall: {
        fontSize: 14,
        lineHeight: 18,
    },
    descriptionLarge: {
        fontSize: 17,
        lineHeight: 22,
    },
}); 