import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import IMAGES from '../../constants/Images';
import { qk } from '../../lib/queryKeys';
import { ArticleService } from '../../services/articleService';
import { homeStyles as styles } from '../../styles/home';

interface TopPickCardProps {
    id: string;
    title: string;
    image: any;
    onPress?: () => void;
}

const TopPickCardComponent = ({ id, title, image, onPress }: TopPickCardProps) => {
    const queryClient = useQueryClient();

    const imageSource = typeof image === 'string' ? { uri: image } : image;
    const truncatedTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;

    const handlePress = async () => {
        // Prefetch the article data before navigation
        try {
            await queryClient.prefetchQuery({
                queryKey: qk.articleById(id),
                queryFn: () => ArticleService.getArticle(id),
                staleTime: 1000 * 60 * 10, // 10 minutes
            });
        } catch (error) {
            console.error('Error prefetching article:', error);
        }

        // Navigate to article detail
        onPress?.();
    };

    return (
        <TouchableOpacity
            style={styles.topPickCard}
            onPress={handlePress}
            accessible
            accessibilityLabel={`Top pick: ${title}`}
        >
            <Image
                source={imageSource}
                style={styles.topPickImage}
                contentFit="cover"
                transition={300}
                priority="high"
                cachePolicy="disk"
                placeholder={IMAGES.ARTICLE_PLACEHOLDER}
                placeholderContentFit="cover"
            />
            <Text style={styles.topPickTitle} numberOfLines={2} ellipsizeMode="tail">
                {truncatedTitle}
            </Text>
        </TouchableOpacity>
    );
};

export const TopPickCard = React.memo(TopPickCardComponent); 