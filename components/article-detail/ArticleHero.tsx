import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Article } from '../../types/article';
import { ThemedText } from '../layout/ThemedText';

interface ArticleHeroProps {
    article: Article;
    textColor: string;
    subtitleColor: string;
}

/**
 * Hero section component for article detail screen
 */
export function ArticleHero({ article, textColor, subtitleColor }: ArticleHeroProps) {
    const imageSource = typeof article.imageUrl === 'number'
        ? article.imageUrl
        : { uri: article.imageUrl };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={imageSource}
                    style={styles.image}
                    contentFit="cover"
                    transition={300}
                />
            </View>

            <View style={styles.content}>
                <ThemedText type="title" style={[styles.title, { color: textColor }]}>
                    {article.title}
                </ThemedText>

                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <ThemedText style={[styles.source, { color: subtitleColor }]}>
                            {article.source}
                        </ThemedText>
                    </View>
                    <View style={[styles.dot, { backgroundColor: subtitleColor }]} />
                    <View style={styles.metaItem}>
                        <ThemedText style={[styles.readingTime, { color: subtitleColor }]}>
                            {article.readingTime} min read
                        </ThemedText>
                    </View>
                    <View style={[styles.dot, { backgroundColor: subtitleColor }]} />
                    <View style={styles.metaItem}>
                        <ThemedText style={[styles.date, { color: subtitleColor }]}>
                            {new Date(article.savedAt).toLocaleDateString()}
                        </ThemedText>
                    </View>
                </View>

                <ThemedText style={[styles.description, { color: subtitleColor }]}>
                    {article.description}
                </ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    imageContainer: {
        position: 'relative',
        height: 300,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 36,
        marginBottom: 16,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    metaItem: {
        marginRight: 8,
    },
    source: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    readingTime: {
        fontSize: 14,
        fontWeight: '500',
    },
    date: {
        fontSize: 14,
        fontWeight: '500',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        marginRight: 8,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
        opacity: 0.8,
    },
}); 