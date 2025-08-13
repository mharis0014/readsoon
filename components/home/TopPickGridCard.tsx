import { Image } from 'expo-image';
import React, { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import IMAGES from '../../constants/Images';
import { topPicksStyles as styles } from '../../styles/topPicks';

interface TopPickGridCardProps {
    id: string;
    title: string;
    image: any;
    onPress?: () => void;
}

const TopPickGridCardComponent = ({ id, title, image, onPress }: TopPickGridCardProps) => {
    const imageSource = typeof image === 'string' ? { uri: image } : image;
    const truncatedTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;

    return (
        <TouchableOpacity
            style={styles.topPickCard}
            onPress={onPress}
            accessible
            accessibilityLabel={`Top pick: ${title}`}
        >
            <Image
                source={imageSource}
                style={styles.topPickImage}
                contentFit="cover"
                transition={300}
                placeholder={IMAGES.ARTICLE_PLACEHOLDER}
                placeholderContentFit="cover"
            />
            <Text style={styles.topPickTitle} numberOfLines={1} ellipsizeMode="tail">
                {truncatedTitle}
            </Text>
        </TouchableOpacity>
    );
};

export const TopPickGridCard = memo(TopPickGridCardComponent);