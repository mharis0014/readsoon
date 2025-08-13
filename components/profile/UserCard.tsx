import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { User } from '../../types/user';
import { ThemedText } from '../layout/ThemedText';
import IMAGES from '@/constants/Images';

interface UserCardProps {
    user: User | null;
    onEdit: () => void;
    textColor: string;
    subtitleColor: string;
    accentColor: string;
    backgroundColor: string;
    blurTint: 'light' | 'dark';
    avatarSize: number;
    padding: number;
    borderRadius: number;
}

/**
 * Professional user card component
 */
export function UserCard({
    user,
    onEdit,
    textColor,
    subtitleColor,
    accentColor,
    backgroundColor,
    blurTint,
    avatarSize,
    padding,
    borderRadius
}: UserCardProps) {
    return (
        <BlurView
            intensity={backgroundColor === '#f8f8f8' ? 15 : 35}
            tint={blurTint}
            style={styles.blurWrap}
        >
            <View
                style={[
                    styles.userInfoContainer,
                    {
                        backgroundColor: backgroundColor === '#f8f8f8' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.35)',
                        padding,
                        borderRadius,
                    },
                ]}
            >
                <Image
                    source={user?.avatar || require('@/assets/images/user.jpg')}
                    style={[
                        styles.avatar,
                        {
                            width: avatarSize,
                            height: avatarSize,
                            borderRadius: avatarSize / 2,
                        }
                    ]}
                    contentFit="cover"
                    priority="high"
                    cachePolicy="disk"
                    placeholder={IMAGES.USER}
                    placeholderContentFit="cover"
                />

                <View style={styles.userInfo}>
                    <ThemedText type="subtitle" style={[styles.username, { color: textColor }]}>
                        {user?.username || 'User'}
                    </ThemedText>
                    <ThemedText style={[styles.email, { color: subtitleColor }]}>
                        {user?.email || 'user@example.com'}
                    </ThemedText>
                </View>

                <TouchableOpacity
                    style={[styles.editButton, { width: avatarSize * 0.6, height: avatarSize * 0.6, borderRadius: (avatarSize * 0.6) / 2 }]}
                    onPress={onEdit}
                    activeOpacity={0.7}
                >
                    <Feather name="edit" size={avatarSize * 0.3} color={accentColor} />
                </TouchableOpacity>
            </View>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    blurWrap: {
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 18,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    userInfo: {
        flex: 1,
        marginLeft: 16,
    },
    username: {
        fontWeight: '600',
        marginBottom: 2,
    },
    email: {
        fontSize: 13,
    },
    editButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
}); 