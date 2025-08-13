import React from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Article } from '../../types/article';
import { ArticleListItem } from '../cards/ArticleListItem';

interface SavedArticlesListProps {
    articles: Article[];
    onArticlePress: (article: Article) => void;
    onRemoveArticle: (articleId: string) => void;
    ListEmptyComponent?: React.ComponentType<any>;
    searchQuery?: string;
    refreshing?: boolean;
    onRefresh?: () => void;
}

/**
 * List component for displaying saved articles
 */
export function SavedArticlesList({
    articles,
    onArticlePress,
    onRemoveArticle,
    ListEmptyComponent,
    refreshing = false,
    onRefresh
}: SavedArticlesListProps) {
    const renderArticle = ({ item }: { item: Article }) => (
        <ArticleListItem
            article={item}
            onPress={() => onArticlePress(item)}
        />
    );

    return (
        <FlatList
            data={articles}
            keyExtractor={(item) => item.id}
            renderItem={renderArticle}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={ListEmptyComponent}
            showsVerticalScrollIndicator={false}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.red}
                        colors={[Colors.red]}
                    />
                ) : undefined
            }
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 0,
        flexGrow: 1,
    },
}); 