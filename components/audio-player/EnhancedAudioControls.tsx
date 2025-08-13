import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../layout/ThemedText';

interface EnhancedAudioControlsProps {
    isPlaying: boolean;
    duration: number;
    position: number;
    onPlayPause: () => void;
    onSeek: (position: number) => void;
    onForward: () => void;
    onBackward: () => void;
    onSpeedChange?: () => void;
    onSleepTimer?: () => void;
    textColor: string;
    accentColor: string;
    blurTint: 'light' | 'dark';
    isLoading?: boolean;
}

export function EnhancedAudioControls({
    isPlaying,
    duration,
    position,
    onPlayPause,
    onSeek,
    onForward,
    onBackward,
    onSpeedChange,
    onSleepTimer,
    textColor,
    accentColor,
    blurTint,
    isLoading = false,
}: EnhancedAudioControlsProps) {
    const insets = useSafeAreaInsets();

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            {/* Single subtle top fade */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.05)']}
                style={styles.gradient}
                pointerEvents="none"
            />
            <BlurView intensity={40} tint={blurTint} style={styles.blurContainer}>
                {/* Time row */}
                <View style={styles.timeContainer}>
                    <ThemedText style={[styles.timeText, { color: textColor }]}>{formatTime(position)}</ThemedText>
                    <ThemedText style={[styles.timeText, { color: textColor }]}>{formatTime(duration)}</ThemedText>
                </View>

                {/* Main controls */}
                <View style={styles.mainControls}>
                    <TouchableOpacity
                        style={[styles.secondaryButton, isLoading && styles.disabledButton]}
                        onPress={onBackward}
                        activeOpacity={0.7}
                        disabled={isLoading}
                    >
                        <Ionicons name="play-back" size={24} color={isLoading ? textColor + '40' : textColor} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.playButton, isLoading && styles.disabledPlayButton]}
                        onPress={onPlayPause}
                        activeOpacity={0.85}
                        disabled={isLoading}
                    >
                        <LinearGradient
                            colors={isLoading ? [textColor + '40', textColor + '20'] : [accentColor, `${accentColor}CC`]}
                            style={styles.playButtonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons
                                name={isLoading ? 'hourglass-outline' : (isPlaying ? 'pause' : 'play')}
                                size={34}
                                color="#fff"
                            />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.secondaryButton, isLoading && styles.disabledButton]}
                        onPress={onForward}
                        activeOpacity={0.7}
                        disabled={isLoading}
                    >
                        <Ionicons name="play-forward" size={24} color={isLoading ? textColor + '40' : textColor} />
                    </TouchableOpacity>
                </View>

                {/* Extra controls */}
                <View style={styles.additionalControls}>
                    <TouchableOpacity
                        style={[styles.iconButton, isLoading && styles.disabledButton]}
                        onPress={onSpeedChange}
                        activeOpacity={0.7}
                        disabled={isLoading}
                    >
                        <Ionicons name="speedometer-outline" size={22} color={isLoading ? textColor + '40' : textColor} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.iconButton, isLoading && styles.disabledButton]}
                        onPress={onSleepTimer}
                        activeOpacity={0.7}
                        disabled={isLoading}
                    >
                        <Ionicons name="time-outline" size={22} color={isLoading ? textColor + '40' : textColor} />
                    </TouchableOpacity>
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
        paddingTop: 12,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.15)',
    },
    content: {
        alignItems: 'center',
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 12,
    },
    timeText: {
        fontSize: 14,
        fontWeight: '500',
        opacity: 0.8,
    },
    mainControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    secondaryButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 20,
    },
    playButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0a7ea4',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
        marginHorizontal: 20,
    },
    playButtonGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    additionalControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 6,
    },
    disabledButton: {
        opacity: 0.5,
    },
    disabledPlayButton: {
        opacity: 0.7,
    },
});
