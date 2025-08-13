import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface AudioWaveformProps {
    position: number;
    duration: number;
    onSeek: (position: number) => void;
    accentColor: string;
    inactiveColor: string;
}

/**
 * Waveform visualization component
 */
export function AudioWaveform({ position, duration, onSeek, accentColor, inactiveColor }: AudioWaveformProps) {
    const progress = duration > 0 ? position / duration : 0;
    const containerRef = useRef<View>(null);

    const waveformData = useMemo(() => {
        return Array.from({ length: 50 }).map((_, index) => ({
            id: index,
            height: Math.random() * 40 + 10,
        }));
    }, []);

    const handleWaveformPress = (event: any) => {
        const { locationX } = event.nativeEvent;

        containerRef.current?.measure((x, y, width, height) => {
            if (width > 0) {
                const percentage = locationX / width;
                const newPosition = percentage * duration;
                onSeek(Math.max(0, Math.min(newPosition, duration)));
            }
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                ref={containerRef}
                style={styles.waveformContainer}
                onPress={handleWaveformPress}
                activeOpacity={0.8}
            >
                <View style={styles.waveform}>
                    {waveformData.map((bar) => (
                        <View
                            key={bar.id}
                            style={[
                                styles.waveformBar,
                                {
                                    height: bar.height,
                                    backgroundColor: inactiveColor,
                                }
                            ]}
                        />
                    ))}
                </View>

                {/* Progress indicator */}
                <View style={[styles.progressIndicator, { left: `${progress * 100}%` }]}>
                    <LinearGradient
                        colors={[accentColor, `${accentColor}80`]}
                        style={styles.indicatorGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 80,
        justifyContent: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    waveformContainer: {
        position: 'relative',
        width: '100%',
        height: 60,
        justifyContent: 'center',
    },
    waveform: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        paddingHorizontal: 4,
    },
    waveformBar: {
        width: 3,
        borderRadius: 2,
        marginHorizontal: 1,
    },
    progressIndicator: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: 'transparent',
    },
    indicatorGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 1,
    },
}); 