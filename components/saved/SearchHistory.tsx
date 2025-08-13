import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { spacing, typography } from '../../utils/responsive';

interface SearchHistoryProps {
    searchHistory: string[];
    onSelectQuery: (query: string) => void;
    onClearHistory: () => void;
    visible: boolean;
}

export function SearchHistory({
    searchHistory,
    onSelectQuery,
    onClearHistory,
    visible,
}: SearchHistoryProps) {
    const textColor = useThemeColor({ light: '#333333', dark: '#f5f5f5' }, 'text');
    const subtitleColor = useThemeColor({ light: '#666666', dark: '#a0a0a0' }, 'text');
    const accentColor = useThemeColor({ light: '#0a7ea4', dark: '#4fc3f7' }, 'text');
    const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'text');

    if (!visible || searchHistory.length === 0) {
        return null;
    }

    return (
        <View style={[styles.container, { borderTopColor: borderColor }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: textColor }]}>
                    Recent Searches
                </Text>
                <TouchableOpacity onPress={onClearHistory} hitSlop={8}>
                    <Text style={[styles.clearText, { color: accentColor }]}>
                        Clear
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
                {searchHistory.map((query, index) => (
                    <TouchableOpacity
                        key={`${query}-${index}`}
                        style={[styles.historyItem, { borderBottomColor: borderColor }]}
                        onPress={() => onSelectQuery(query)}
                    >
                        <Ionicons
                            name="time-outline"
                            size={16}
                            color={subtitleColor}
                            style={styles.historyIcon}
                        />
                        <Text style={[styles.historyText, { color: textColor }]} numberOfLines={1}>
                            {query}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        maxHeight: 200,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    title: {
        fontSize: typography.sm,
        fontWeight: '600',
    },
    clearText: {
        fontSize: typography.sm,
        fontWeight: '500',
    },
    historyList: {
        maxHeight: 150,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 0.5,
    },
    historyIcon: {
        marginRight: spacing.sm,
    },
    historyText: {
        flex: 1,
        fontSize: typography.sm,
    },
}); 