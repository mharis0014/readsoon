import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ArticleHeaderProps {
    onBack: () => void;
    onBookmark: () => void;
    onShare: () => void;
    isBookmarked: boolean;
    textColor: string;
    backgroundColor: string;
    blurTint: 'light' | 'dark';
}

/**
 * Header component for article detail screen
 */
export function ArticleHeader({ onBack, onBookmark, onShare, isBookmarked, textColor }: ArticleHeaderProps) {
    const insets = useSafeAreaInsets();
    const statusBarHeight = StatusBar.currentHeight || 0;
    const totalTopPadding = Math.max(statusBarHeight, insets.top);

    return (
        <View style={[styles.container, { paddingTop: totalTopPadding }]}>
            <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'transparent']}
                style={styles.gradient}
                pointerEvents="none"
            />
            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.button, styles.backButton]}
                    onPress={onBack}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="arrow-back" size={24} color={textColor} />
                </TouchableOpacity>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onBookmark}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                            size={24}
                            color={isBookmarked ? '#0a7ea4' : textColor}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onShare}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="share-outline" size={24} color={textColor} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    backButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginLeft: 8,
    },
}); 