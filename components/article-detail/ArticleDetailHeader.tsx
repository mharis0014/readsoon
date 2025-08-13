import IMAGES from '@/constants/Images';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import ICONS from '../../constants/Icons';
import { articleDetailStyles as styles } from '../../styles/article-detail';

interface ArticleDetailHeaderProps {
    title: string;
    category: string;
    image: any;
    author: string;
    date: string;
    authorImage?: any;
    readingTime?: number;
    wordCount?: number;
    onBack: () => void;
    onBookmark: () => void;
    onShare: () => void;
    isBookmarked: boolean;
}

export default function ArticleDetailHeader({
    title,
    category,
    image,
    author,
    date,
    authorImage,
    readingTime,
    wordCount,
    onBack,
    onBookmark,
    onShare,
    isBookmarked
}: ArticleDetailHeaderProps) {
    return (
        <View>
            <View style={styles.heroContainer}>
                <Image source={image} style={styles.heroImage} />

                {/* Navigation Bar */}
                <SafeAreaView style={styles.headerContent}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Image source={ICONS.CLOSE_LIGHT} style={styles.backButtonIcon} />
                        </TouchableOpacity>
                        <View style={styles.headerActions}>
                            <TouchableOpacity onPress={onBookmark} style={styles.actionButton}>
                                <Image source={ICONS.PLUS} style={styles.actionButtonIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onShare} style={styles.actionButton}>
                                <Image source={ICONS.DOTS_THREE_CIRCLE} style={styles.actionButtonIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>

                {/* Hero Content Overlay */}
                <View style={styles.heroOverlay}>
                    <Text style={styles.categoryTag}>{category}</Text>
                    <Text style={styles.heroTitle}>{title}</Text>
                </View>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.profileInfo}>
                    <Image
                        source={authorImage || IMAGES.USER}
                        style={styles.profileImage}
                    />
                    <View style={styles.profileText}>
                        <Text style={styles.authorName}>{author}</Text>
                        <View style={styles.metaInfo}>
                            <Text style={styles.publishDate}>{date}</Text>
                            {readingTime && (
                                <View style={styles.metaItem}>
                                    <Ionicons name="time-outline" size={14} color={Colors.gray} />
                                    <Text style={styles.readingTime}>{readingTime} min read</Text>
                                </View>
                            )}
                            {wordCount && (
                                <View style={styles.metaItem}>
                                    <Ionicons name="document-text-outline" size={14} color={Colors.gray} />
                                    <Text style={styles.wordCount}>{wordCount} words</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.bookmarkButton, isBookmarked && styles.bookmarkButtonActive]}
                    onPress={onBookmark}
                >
                    <MaterialCommunityIcons
                        name={isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={24}
                        color={Colors.white}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
} 