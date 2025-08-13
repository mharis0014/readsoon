import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { device, spacing } from '../../utils/responsive';
import { ThemedText } from '../layout/ThemedText';

interface HomeHeaderProps {
    username: string;
    textColor: string;
    subtitleColor: string;
    fontSize: number;
    avatarSize: number;
}

/**
 * Header component for home screen
 */
export function HomeHeader({ username, textColor, subtitleColor, fontSize, avatarSize }: HomeHeaderProps) {
    const router = useRouter();

    return (
        <View style={{
            marginTop: device.isAndroid ? spacing.xl : 0,
            marginBottom: spacing.lg,
            paddingHorizontal: spacing.md,
        }}>
            <View style={styles.welcomeRow}>
                <View style={{ flex: 1, marginRight: spacing.md }}>
                    <ThemedText
                        type="title"
                        style={{
                            color: textColor,
                            fontSize,
                            fontWeight: '700',
                            lineHeight: fontSize * 1.2,
                        }}
                    >
                        Hello, {username || 'Reader'}
                    </ThemedText>
                    <ThemedText style={{
                        color: subtitleColor,
                        marginTop: spacing.xs,
                        fontSize: fontSize * 0.5,
                        lineHeight: fontSize * 0.8,
                    }}>
                        What would you like to read today?
                    </ThemedText>
                </View>
                <TouchableOpacity onPress={() => router.push('/profile')}>
                    <Image
                        source={require('@/assets/images/user.jpg')}
                        style={[
                            styles.avatar,
                            {
                                width: avatarSize,
                                height: avatarSize,
                                borderRadius: avatarSize / 2,
                                borderWidth: spacing.xs / 2,
                            }
                        ]}
                        priority="high"
                        cachePolicy="disk"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    welcomeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    avatar: {
        borderColor: 'rgba(255,255,255,0.2)',
    },
}); 