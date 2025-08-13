import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Colors } from '../../constants/Colors';
import IMAGES from '../../constants/Images';
import { qk } from '../../lib/queryKeys';
import { ArticleService } from '../../services/articleService';
import { Article } from '../../types/article';
import { spacing, typography } from '../../utils/responsive';

interface ArticleListItemProps {
    article: Article;
    onPress: () => void;
    style?: ViewStyle;
}

export function ArticleListItem({ article, onPress, style }: ArticleListItemProps) {
    const [imageError, setImageError] = useState(false);
    const queryClient = useQueryClient();

    const imageSource = typeof article.imageUrl === 'number'
        ? article.imageUrl
        : article.imageUrl
            ? { uri: article.imageUrl }
            : IMAGES.ARTICLE_PLACEHOLDER;

    const handlePress = async () => {
        try {
            await queryClient.prefetchQuery({
                queryKey: qk.articleById(article.id),
                queryFn: () => ArticleService.getArticle(article.id),
                staleTime: 1000 * 60 * 10, // 10 minutes
            });
        } catch (error) {
            console.error('Error prefetching article:', error);
        }

        // Navigate to article detail
        onPress();
    };

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            {/* Left side - Image */}
            {!imageError ? (
                <Image
                    source={imageSource}
                    style={styles.image}
                    contentFit="cover"
                    transition={300}
                    priority="high"
                    cachePolicy="disk"
                    onError={() => setImageError(true)}
                />
            ) : (
                <View style={[styles.image, styles.placeholderImage]}>
                    <Ionicons name="image-outline" size={24} color={Colors.gray} />
                </View>
            )}

            {/* Right side - Content */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {article.title}
                </Text>

                <Text style={styles.author}>
                    {article.source || 'Unknown'}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 8,
    },
    image: {
        width: 130,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    placeholderImage: {
        backgroundColor: Colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: typography.sm,
        fontWeight: '700',
        color: Colors.black,
        marginBottom: spacing.xs,
        lineHeight: 22,
    },
    author: {
        fontSize: typography.xs,
        fontWeight: '400',
        color: Colors.gray,
    }
});