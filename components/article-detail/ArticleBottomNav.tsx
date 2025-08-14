import { typography } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { articleDetailStyles as styles } from '../../styles/article-detail';

interface ArticleBottomNavProps {
    onShare: () => void;
    onOpenInBrowser: () => void;
    onPlayAudio: () => void;
    articleContent: string;
    articleTitle?: string;
    articleSource?: string;
    articleImage?: any;
    isReadingMode?: boolean;
    onToggleReadingMode?: () => void;
}

export default function ArticleBottomNav({
    onShare,
    onOpenInBrowser,
    onPlayAudio,
    articleContent,
    articleTitle,
    articleSource,
    articleImage,
    isReadingMode = false,
    onToggleReadingMode
}: ArticleBottomNavProps) {

    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navButton} onPress={onPlayAudio}>
                <Ionicons name="play-outline" size={typography.xxl} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} onPress={onOpenInBrowser}>
                <Ionicons name="compass-outline" size={typography.xxl} color="#6b7280" />
            </TouchableOpacity>

            {/* Reader Mode toggle (book icon) */}
            <TouchableOpacity
                style={styles.navButton}
                onPress={onToggleReadingMode}
                accessibilityLabel="Toggle reading mode"
            >
                <Ionicons
                    name={isReadingMode ? 'book' : 'book-outline'}
                    size={typography.xxl}
                    color={isReadingMode ? Colors.primary : '#6b7280'}
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} onPress={onShare}>
                <Ionicons name="share-social-outline" size={typography.xxl} color="#6b7280" />
            </TouchableOpacity>
        </View>
    );
}
