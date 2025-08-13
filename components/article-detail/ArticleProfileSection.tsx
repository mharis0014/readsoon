import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image } from 'expo-image';
import { Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { articleDetailStyles as styles } from '../../styles/article-detail';

interface ArticleProfileSectionProps {
    author: string;
    date: string;
    isBookmarked: boolean;
    onBookmark: () => void;
}

export default function ArticleProfileSection({
    author,
    date,
    isBookmarked,
    onBookmark
}: ArticleProfileSectionProps) {
    return (
        <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
                <Image
                    source={require('../../assets/images/user.jpg')}
                    style={styles.profileImage}
                />
                <View style={styles.profileText}>
                    <Text style={styles.authorName}>{author}</Text>
                    <Text style={styles.publishDate}>{date}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.bookmarkButton, isBookmarked && styles.bookmarkButtonActive]}
                onPress={onBookmark}
            >
                <MaterialCommunityIcons
                    name={isBookmarked ? "bookmark" : "bookmark-outline"}
                    size={24}
                    color={isBookmarked ? Colors.white : Colors.red}
                />
            </TouchableOpacity>
        </View>
    );
} 