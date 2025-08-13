import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface AudioPlayerHeaderProps {
    onClose: () => void;
    onMore: () => void;
    textColor: string;
    blurTint: 'light' | 'dark';
}

/**
 * Header component for audio player screen
 */
export function AudioPlayerHeader({ onClose, onMore, textColor, blurTint }: AudioPlayerHeaderProps) {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'transparent']}
                style={styles.gradient}
                pointerEvents="none"
            />
            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.button, styles.closeButton]}
                    onPress={onClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="chevron-down" size={28} color={textColor} />
                </TouchableOpacity>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onMore}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="ellipsis-horizontal" size={24} color={textColor} />
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
        paddingTop: 50,
        paddingBottom: 16,
    },
    closeButton: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
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
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginLeft: 8,
    },
});
