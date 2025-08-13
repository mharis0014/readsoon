import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, ScrollView, StatusBar, Text, View } from 'react-native';

import { SectionHeader } from '../../components/home/SectionHeader';
import { StaffPickCard } from '../../components/home/StaffPickCard';
import { TopPickCard } from '../../components/home/TopPickCard';

import { Colors } from '../../constants/Colors';

import { useHybridUser } from '../../context/HybridUserContext';
import { useLinks } from '../../hooks/useLinks';
import { homeStyles as styles } from '../../styles/home';
import { getFirstName } from '../../utils/greeting';

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useHybridUser();
  const { data: savedArticles = [], isLoading: loading } = useLinks({
    userId: user?.id,
  });

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
                title={item.title || 'Untitled'}
                image={item.image_url || ''}
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
                title={item.title || 'Untitled'}
                image={item.image_url || ''}
                author={item.domain || 'Unknown'}
                date={item.created_at}
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