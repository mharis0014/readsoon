import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { ArticleListItem } from '../components/cards/ArticleListItem';
import { Colors } from '../constants/Colors';
import { useHybridUser } from '../context/HybridUserContext';
import { ArticleService } from '../services/articleService';
import { articleListStyles as styles } from '../styles/articleList';
import { Article } from '../types/article';

const ArticlesScreen = () => {
    const router = useRouter();
    const { user } = useHybridUser();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchArticles = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const fetchedArticles = await ArticleService.getUserArticles(user.id);
            setArticles(fetchedArticles);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [user?.id]);

    const handleBackPress = () => {
        router.back();
    };

    const handleArticlePress = (article: Article) => {
        router.push({
            pathname: '/article-detail',
            params: { id: article.id, type: 'saved' }
        });
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchArticles();
        setRefreshing(false);
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No articles found</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.red} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackPress}
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="chevron-back" size={24} color={Colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Articles</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Articles List */}
            <FlatList
                data={articles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ArticleListItem
                        article={item}
                        onPress={() => handleArticlePress(item)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={Colors.red}
                        colors={[Colors.red]}
                    />
                }
            />
        </View>
    );
};

export default ArticlesScreen;