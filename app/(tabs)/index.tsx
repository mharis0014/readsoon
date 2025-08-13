import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StatusBar, Text, View } from 'react-native';

import { SectionHeader } from '../../components/home/SectionHeader';
import { StaffPickCard } from '../../components/home/StaffPickCard';
import { TopPickCard } from '../../components/home/TopPickCard';

import { Colors } from '../../constants/Colors';

import { useHybridUser } from '../../context/HybridUserContext';
import { ArticleService } from '../../services/articleService';
import { homeStyles as styles } from '../../styles/home';
import { Article } from '../../types/article';
import { getFirstName } from '../../utils/greeting';

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useHybridUser();
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved articles
  useEffect(() => {
    const fetchSavedArticles = async () => {
      if (user?.id) {
        try {
          const articles = await ArticleService.getUserArticles(user.id);
          setSavedArticles(articles);
        } catch (error) {
          console.error('Error fetching saved articles:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchSavedArticles();
  }, [user?.id]);

  const handleTopPicksPress = () => router.push('/top-picks');
  const handleStaffPicksPress = () => router.push('/staff-picks');
  const handleTopPickPress = (id: string) => router.push(`/article-detail?id=${id}&type=saved`);
  const handleStaffPickPress = (id: string) => router.push(`/article-detail?id=${id}&type=saved`);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.red} />
      <ScrollView>
        {/* Greeting Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {getFirstName(user)}!</Text>
          <Text style={styles.subtitle}>Ready for today&apos;s learning journey?</Text>
        </View>

        {/* Top Picks */}
        <SectionHeader
          title="Top Picks"
          onPress={handleTopPicksPress}
          accessibilityLabel="See all Top Picks"
        />
        {savedArticles.length > 0 ? (
          <FlatList
            horizontal
            data={savedArticles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TopPickCard
                id={item.id}
                title={item.title}
                image={item.imageUrl}
                onPress={() => handleTopPickPress(item.id)}
              />
            )}
            contentContainerStyle={styles.horizontalList}
            showsHorizontalScrollIndicator={false}
            getItemLayout={(data, index) => ({
              length: 214 + 32, // height + margin
              offset: (214 + 32) * index,
              index,
            })}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {loading ? 'Loading top picks...' : 'No top picks yet. Add some articles!'}
            </Text>
          </View>
        )}

        {/* Saved Articles */}
        <SectionHeader
          title="Saved Articles"
          onPress={handleStaffPicksPress}
          accessibilityLabel="See all Saved Articles"
        />
        {savedArticles.length > 0 ? (
          <FlatList
            horizontal
            data={savedArticles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <StaffPickCard
                id={item.id}
                title={item.title}
                image={item.imageUrl}
                author={item.source || 'Unknown'}
                date={item.savedAt}
                onPress={() => handleStaffPickPress(item.id)}
              />
            )}
            contentContainerStyle={styles.horizontalList}
            showsHorizontalScrollIndicator={false}
            getItemLayout={(data, index) => ({
              length: 280 + 32, // height + margin
              offset: (280 + 32) * index,
              index,
            })}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {loading ? 'Loading saved articles...' : 'No saved articles yet. Add some articles!'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;