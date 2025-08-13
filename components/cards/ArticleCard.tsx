import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Colors from '../../constants/Colors';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Article } from '../../types/article';
import { spacing, typography } from '../../utils/responsive';

type ArticleCardProps = {
    article: Article;
    onPress: () => void;
    onSave?: () => void;
    isSaved?: boolean;
    style?: ViewStyle;
    showSaveButton?: boolean;
};

/**
 * Card component for displaying article previews
 */
export function ArticleCard({
    article,
    onPress,
    onSave,
    isSaved = false,
    style,
    showSaveButton = true,
}: ArticleCardProps) {
    const [imageError, setImageError] = useState(false);
    const backgroundColor = useThemeColor({ light: Colors.white, dark: Colors.black }, 'background');
    const textColor = useThemeColor({ light: Colors.black, dark: Colors.white }, 'text');
    const subtitleColor = useThemeColor({ light: Colors.gray, dark: Colors.lightGray }, 'text');
    const borderColor = useThemeColor({ light: Colors.lightGray, dark: Colors.gray }, 'text');

    // Handle image source - can be local asset or remote URL
    const imageSource = typeof article.imageUrl === 'number'
        ? article.imageUrl
        : { uri: article.imageUrl };

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor, borderColor }, style]}
            onPress={onPress}
            activeOpacity={0.7}
        >
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
                    <Ionicons name="image-outline" size={40} color={subtitleColor} />
                </View>
            )}

            <View style={styles.content}>
                <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
                    {article.title}
                </Text>

                <Text style={[styles.description, { color: subtitleColor }]} numberOfLines={2}>
                    {article.description}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.sourceContainer}>
                        <Text style={[styles.source, { color: subtitleColor }]}>
                            {article.source}
                        </Text>
                        <Text style={[styles.dot, { color: subtitleColor }]}>•</Text>
                        <Text style={[styles.readingTime, { color: subtitleColor }]}>
                            {article.readingTime} min read
                        </Text>
                    </View>

                    {showSaveButton && (
                        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                            <Ionicons
                                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                                size={20}
                                color={isSaved ? Colors.blue : subtitleColor}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        marginBottom: spacing.md,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: spacing.xs },
        shadowOpacity: 0.1,
        shadowRadius: spacing.xs,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: spacing.xxl * 5, // 160px equivalent
    },
    placeholderImage: {
        backgroundColor: Colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: spacing.md,
    },
    title: {
        fontSize: typography.lg,
        fontWeight: '600',
        marginBottom: spacing.sm,
        lineHeight: 24,
    },
    description: {
        fontSize: typography.sm,
        lineHeight: 20,
        marginBottom: spacing.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sourceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    source: {
        fontSize: typography.xs,
        fontWeight: '500',
    },
    dot: {
        fontSize: typography.xs,
        marginHorizontal: spacing.xs,
    },
    readingTime: {
        fontSize: typography.xs,
    },
    saveButton: {
        padding: spacing.xs,
    },
}); 