import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import IMAGES from '../../constants/Images';
import { homeStyles as styles } from '../../styles/home';

interface TopPickCardProps {
    id: string;
    title: string;
    image: any;
    onPress?: () => void;
}

const TopPickCardComponent = ({ id, title, image, onPress }: TopPickCardProps) => {

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
            <Text style={styles.topPickTitle} numberOfLines={2} ellipsizeMode="tail">
                {truncatedTitle}
            </Text>
        </TouchableOpacity>
    );
};

export const TopPickCard = React.memo(TopPickCardComponent); 