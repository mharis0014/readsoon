import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Article } from '../../types/article';
import { ThemedText } from '../layout/ThemedText';

const { width } = Dimensions.get('window');

interface AudioPlayerHeroProps {
    article: Article;
    textColor: string;
    subtitleColor: string;
}

/**
 * Hero section component for audio player screen
 */
export function AudioPlayerHero({ article, textColor, subtitleColor }: AudioPlayerHeroProps) {
    const imageSource = typeof article.imageUrl === 'number'
        ? article.imageUrl
        : { uri: article.imageUrl };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={imageSource}
                        style={styles.image}
                        contentFit="cover"
                        transition={300}
                        priority="high"
                        cachePolicy="disk"
                    />
                </View>

                {/* Article title */}
                <View style={styles.titleContainer}>
                    <ThemedText style={[styles.title, { color: textColor }]}>
                        {article.title}
                    </ThemedText>
                </View>
            </View>

            {/* Article details below - smaller and more subtle */}
            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <ThemedText style={styles.detailIcon}>📖</ThemedText>
                    <ThemedText style={[styles.detailText, { color: subtitleColor }]}>
                        {article.source}
                    </ThemedText>
                </View>

                <View style={styles.detailItem}>
                    <ThemedText style={styles.detailIcon}>⏱️</ThemedText>
                    <ThemedText style={[styles.detailText, { color: subtitleColor }]}>
                        {Math.ceil((article.content?.length || 0) / 200)} min read
                    </ThemedText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 16, // Reduced for better spacing
        paddingHorizontal: 16, // Reduced padding
        position: 'relative',
        marginTop: 80, // Reduced for better proportions
    },
    contentContainer: {
        alignItems: 'center',
        marginBottom: 16, // Reduced spacing
    },
    imageContainer: {
        width: width * 0.65, // Slightly smaller for better proportions
        height: width * 0.65,
        borderRadius: 16, // Reduced radius
        overflow: 'hidden',
        marginBottom: 12, // Reduced spacing
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    titleContainer: {
        alignItems: 'center',
        paddingHorizontal: 16, // Reduced padding
        marginBottom: 8, // Add small margin
    },
    title: {
        fontSize: 22, // Slightly smaller
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 28,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 16, // Reduced padding
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)', // Slightly more opaque
        paddingHorizontal: 10, // Reduced padding
        paddingVertical: 5, // Reduced padding
        borderRadius: 10, // Reduced radius
        minWidth: 90, // Smaller width
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 1,
    },
    detailIcon: {
        fontSize: 12, // Smaller icon
        marginRight: 5, // Smaller margin
    },
    detailText: {
        fontSize: 11, // Smaller text
        fontWeight: '500',
    },
});
