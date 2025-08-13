import React from 'react';
import { StyleSheet, View } from 'react-native';
import { device, typography } from '../../utils/responsive';
import { ThemedText } from '../layout/ThemedText';
import { SearchBar } from './SearchBar';
import { SearchHistory } from './SearchHistory';

interface SavedHeaderProps {
    articleCount: number;
    textColor: string;
    subtitleColor: string;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSearchClear: () => void;
    searchHistory: string[];
    onSelectHistoryItem: (query: string) => void;
    onClearHistory: () => void;
    showSearchHistory: boolean;
}

/**
 * Header component for saved articles screen
 */
export function SavedHeader({
    articleCount,
    textColor,
    subtitleColor,
    searchQuery,
    onSearchChange,
    onSearchClear,
    searchHistory,
    onSelectHistoryItem,
    onClearHistory,
    showSearchHistory,
}: SavedHeaderProps) {
    return (
        <View style={styles.header}>
            <ThemedText type="title" style={[styles.title, { color: textColor }]}>
                Saved Articles
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: subtitleColor }]}>
                {articleCount} {articleCount === 1 ? 'article' : 'articles'} saved
            </ThemedText>

            <SearchBar
                value={searchQuery}
                onChangeText={onSearchChange}
                onClear={onSearchClear}
            />

            <SearchHistory
                searchHistory={searchHistory}
                onSelectQuery={onSelectHistoryItem}
                onClearHistory={onClearHistory}
                visible={showSearchHistory}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 16,
        paddingTop: device.isAndroid ? 50 : 0,
        marginTop: 8,
    },
    title: {
        fontSize: typography.xxl,
        fontWeight: '700',
    },
    subtitle: {
        marginTop: 4,
        fontSize: typography.sm,
        opacity: 0.7,
    },
}); 