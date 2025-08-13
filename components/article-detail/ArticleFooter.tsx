import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../layout/ThemedText';

interface ArticleFooterProps {
    onListen: () => void;
    onShare: () => void;
    onBookmark: () => void;
    isBookmarked: boolean;
    textColor: string;
    accentColor: string;
    blurTint: 'light' | 'dark';
}

/**
 * Footer component for article detail screen
 */
export function ArticleFooter({
    onListen,
    onShare,
    onBookmark,
    isBookmarked,
    textColor,
    accentColor,
    blurTint
}: ArticleFooterProps) {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.05)']}
                style={styles.gradient}
                pointerEvents="none"
            />
            <BlurView intensity={Platform.OS === 'ios' ? 50 : 30} tint={blurTint} style={[styles.blurContainer, { paddingBottom: 34 + insets.bottom }]}>
                <View style={styles.content}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={onListen}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="headset-outline" size={24} color="#ffffff" />
                        <ThemedText style={styles.primaryButtonText}>
                            Listen to Article
                        </ThemedText>
                    </TouchableOpacity>

                    <View style={styles.secondaryActions}>
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={onBookmark}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                                size={22}
                                color={isBookmarked ? accentColor : textColor}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={onShare}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="share-outline" size={22} color={textColor} />
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    gradient: {
        position: 'absolute',
        top: -20,
        left: 0,
        right: 0,
        height: 20,
    },
    blurContainer: {
        paddingTop: 16,
        paddingBottom: 34,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.15)',
        backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.9)' : undefined,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    primaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a7ea4',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginRight: 12,
        shadowColor: '#0a7ea4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    secondaryActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    secondaryButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginLeft: 8,
    },
}); 