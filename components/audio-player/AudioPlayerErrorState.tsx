import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../layout/ThemedText';

interface AudioPlayerErrorStateProps {
    title: string;
    message: string;
    onRetry: () => void;
    textColor: string;
    subtitleColor: string;
    iconColor: string;
}

/**
 * Error state component for audio player screen
 */
export function AudioPlayerErrorState({
    title,
    message,
    onRetry,
    textColor,
    subtitleColor,
    iconColor
}: AudioPlayerErrorStateProps) {
    return (
        <View style={styles.container}>
            <Ionicons name="headset-outline" size={80} color={iconColor} />
            <ThemedText type="title" style={[styles.title, { color: textColor }]}>
                {title}
            </ThemedText>
            <ThemedText style={[styles.message, { color: subtitleColor }]}>
                {message}
            </ThemedText>
            <TouchableOpacity
                style={styles.button}
                onPress={onRetry}
                activeOpacity={0.7}
            >
                <ThemedText style={styles.buttonText}>Go Back</ThemedText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        marginBottom: 32,
        fontSize: 16,
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#0a7ea4',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 