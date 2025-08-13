import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../layout/ThemedText';
import { SettingItem } from './SettingItem';

interface SettingsSectionProps {
    title: string;
    items: {
        icon: keyof typeof Ionicons.glyphMap;
        title: string;
        subtitle: string;
        onPress?: () => void;
        rightElement?: React.ReactNode;
    }[];
    textColor: string;
    fontSize: number;
    marginBottom: number;
    gap: number;
}

/**
 * Professional settings section component
 */
export function SettingsSection({
    title,
    items,
    textColor,
    fontSize,
    marginBottom,
    gap
}: SettingsSectionProps) {
    return (
        <View style={styles.container}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor, fontSize, marginBottom }]}>
                {title}
            </ThemedText>

            <View style={[styles.itemsContainer, { gap, marginBottom }]}>
                {items.map((item, index) => (
                    <SettingItem
                        key={`${item.title}-${index}`}
                        icon={item.icon}
                        title={item.title}
                        subtitle={item.subtitle}
                        onPress={item.onPress}
                        rightElement={item.rightElement}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontWeight: '600',
    },
    itemsContainer: {
        marginBottom: 26,
    },
}); 