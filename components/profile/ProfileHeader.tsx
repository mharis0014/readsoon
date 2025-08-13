import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../layout/ThemedText';

interface ProfileHeaderProps {
    title: string;
    textColor: string;
    fontSize: number;
}

/**
 * Professional header component for profile screen
 */
export function ProfileHeader({ title, textColor, fontSize }: ProfileHeaderProps) {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(10,126,164,0.15)', 'transparent']}
                style={styles.accentBlob}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <View style={styles.header}>
                <ThemedText type="title" style={[styles.title, { fontSize, color: textColor }]}>
                    {title}
                </ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    accentBlob: {
        position: 'absolute',
        top: -140,
        right: -100,
        width: 260,
        height: 260,
        borderRadius: 260,
    },
    header: {
        marginBottom: 22,
    },
    title: {
        fontWeight: '700',
    },
}); 