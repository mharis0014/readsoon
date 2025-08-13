import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { TopPickGridCard } from '../components/home/TopPickGridCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Colors } from '../constants/Colors';
import { useHybridUser } from '../context/HybridUserContext';
import { ArticleService } from '../services/articleService';
import { topPicksStyles as styles } from '../styles/topPicks';
import { Article } from '../types/article';

const TopPicksScreen = () => {
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

    const memoizedFetchArticles = useCallback(fetchArticles, [user?.id]);

    useEffect(() => {
        memoizedFetchArticles();
    }, [memoizedFetchArticles]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchArticles();
        setRefreshing(false);
    };

    const handleBackPress = () => router.back();

    const handleTopPickPress = (id: string) => {
        router.push(`/article-detail?id=${id}&type=saved`);
    };

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
                <Text style={styles.headerTitle}>Top Picks</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Grid of Top Picks */}
            {loading && !refreshing ? (
                <LoadingSpinner text="Loading articles..." />
            ) : (
                <FlatList
                    data={articles}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    numColumns={3}
                    renderItem={({ item }) => (
                        <View style={styles.cardContainer}>
                            <TopPickGridCard
                                id={item.id}
                                title={item.title}
                                image={item.imageUrl}
                                onPress={() => handleTopPickPress(item.id)}
                            />
                        </View>
                    )}
                    contentContainerStyle={styles.gridContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={Colors.red}
                            colors={[Colors.red]}
                        />
                    }
                />
            )}
        </View>
    );
};



export default TopPicksScreen;