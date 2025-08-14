/* eslint-disable no-unused-expressions */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAudioPlayerTheme } from '../hooks/useAudioPlayerTheme';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

export default function TextToSpeechScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Get the image from global storage
    const articleImage = (global as any).currentArticleImage;
    const { backgroundColor } = useAudioPlayerTheme();

    // expo-speech rate: 0.1 to 2.0, where 1.0 is normal speed
    const speedOptions = [1.0, 1.5, 2.0, 0.5];
    const [speedIndex, setSpeedIndex] = useState(() => {
        // Initialize with the index corresponding to default speed (1.0)
        return speedOptions.findIndex(speed => Math.abs(speed - 1.0) < 0.01);
    });

    // Get article data from route params
    const articleContent = (params.content as string) || '';
    const articleTitle = (params.title as string) || 'Article';
    const articleSource = (params.source as string) || 'Unknown Source';

    // TTS hook
    const {
        state: ttsState,
        speak,
        pause,
        resume,
        stop,
        seek: ttsSeek,
        updateSpeed,
        settings: ttsSettings
    } = useTextToSpeech(articleContent);

    const currentIsPlaying = ttsState.isPlaying;
    // Use seekPosition when paused, otherwise use current position
    const currentPosition = ttsState.isPaused ? (ttsState.seekPosition || ttsState.position) : ttsState.position;
    const currentDuration = ttsState.duration;
    const isAudioLoading = false;

    // Simple progress calculation
    const progressPercent = currentDuration > 0 ? (currentPosition / currentDuration) * 100 : 0;

    // Auto-play audio when component mounts
    useEffect(() => {
        if (articleContent && articleContent.trim().length > 0 && !currentIsPlaying && !ttsState.isPaused) {
            // Small delay to ensure the component is fully mounted
            const timer = setTimeout(() => {
                speak().catch(error => {
                    console.error('Auto-play failed:', error);
                });
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [articleContent, currentIsPlaying, ttsState.isPaused, speak]);

    const handlePlayPause = async () => {
        try {
            if (currentIsPlaying) {
                pause();
            } else if (ttsState.isPaused) {
                await resume();
            } else {
                await speak();
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'Failed to control audio playback';
            Alert.alert('Audio Error', `${errorMessage}\n\nPlease try again.`, [{ text: 'OK' }]);
            console.error('TTS control error:', error);
        }
    };

    const handleForward = async () => {
        if (currentDuration > 0) {
            const newPosition = Math.min(currentPosition + 15, currentDuration);
            ttsSeek(newPosition);
        }
    };

    const handleBackward = async () => {
        if (currentDuration > 0) {
            const newPosition = Math.max(currentPosition - 15, 0);
            ttsSeek(newPosition);
        }
    };

    const handleSpeedChange = () => {
        const nextSpeedIndex = (speedIndex + 1) % speedOptions.length;
        const newSpeed = speedOptions[nextSpeedIndex];
        setSpeedIndex(nextSpeedIndex);
        updateSpeed(newSpeed);
    };

    // Sync speed index with TTS settings
    useEffect(() => {
        const currentSpeed = ttsSettings.speed || 1.0;
        const newSpeedIndex = speedOptions.findIndex(speed => Math.abs(speed - currentSpeed) < 0.01);
        if (newSpeedIndex !== -1 && newSpeedIndex !== speedIndex) {
            setSpeedIndex(newSpeedIndex);
        }
    }, [ttsSettings.speed]);

    const handleVoiceChange = () => {
        Alert.alert('Voice Selection', 'Voice selection will be available in a future update.', [{ text: 'OK' }]);
    };

    const handleSleepTimer = () => {
        Alert.alert('Sleep Timer', 'Sleep timer functionality will be implemented in a future update.', [{ text: 'OK' }]);
    };

    const handleClose = () => {
        stop();
        router.back();
    };

    const handleMore = () => {
        Alert.alert(
            'Voice Settings',
            `Speed: ${speedOptions[speedIndex]}x\n\nVoice selection and additional options will be available in a future update.`,
            [{ text: 'OK' }]
        );
    };

    const blurTint = backgroundColor === '#f8f8f8' ? 'light' : 'dark';

    if (!articleContent || articleContent.trim().length === 0) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
                <StatusBar style="light" />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                        No Article Content
                    </Text>
                    <Text style={{ color: '#999', fontSize: 14, textAlign: 'center' }}>
                        This article has no content to read. Please try a different article.
                    </Text>
                    <TouchableOpacity
                        onPress={handleClose}
                        style={{
                            marginTop: 20,
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            backgroundColor: '#333',
                            borderRadius: 8
                        }}
                    >
                        <Text style={{ color: '#fff' }}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const formatTime = (seconds: number) => {
        const secs = Math.max(0, Math.floor(seconds || 0));
        const mins = Math.floor(secs / 60);
        const rem = secs % 60;
        return `${mins}:${rem.toString().padStart(2, '0')}`;
    };

    const formatRemainingTime = (current: number, total: number) => {
        const remaining = Math.max(0, (total || 0) - (current || 0));
        const mins = Math.floor(remaining / 60);
        const secs = Math.floor(remaining % 60);
        return `- ${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar style="light" />

            {/* Close button */}
            <TouchableOpacity
                onPress={handleClose}
                style={{
                    position: 'absolute',
                    top: 50,
                    right: 20,
                    zIndex: 10,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Main content */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>

                {/* Album Art / Article Image */}
                <View style={{
                    width: 280,
                    height: 280,
                    backgroundColor: '#333',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 40,
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Blurred background image */}
                    {articleImage && (
                        <Image
                            source={articleImage}
                            style={{
                                position: 'absolute',
                                top: -20,
                                left: -20,
                                right: -20,
                                bottom: -20,
                                width: 320,
                                height: 320,
                            }}
                            contentFit="cover"
                            blurRadius={20}
                        />
                    )}

                    {/* Dark overlay for better contrast */}
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        borderRadius: 20
                    }} />

                    {/* Article Image or Logo */}
                    {articleImage ? (
                        <Image
                            source={articleImage}
                            style={{
                                width: 120,
                                height: 120,
                                borderRadius: 15,
                            }}
                            contentFit="cover"
                            priority="high"
                            cachePolicy="disk"
                        />
                    ) : (
                        <View style={{
                            width: 120,
                            height: 120,
                            backgroundColor: '#fff',
                            borderRadius: 15,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <View style={{
                                width: 80,
                                height: 80,
                                backgroundColor: '#000',
                                borderRadius: 40,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>
                                    {articleTitle.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Article Title */}
                <Text style={{
                    color: '#fff',
                    fontSize: 24,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: 8
                }}>
                    {articleTitle}
                </Text>

                {/* Source */}
                <Text style={{
                    color: '#999',
                    fontSize: 16,
                    marginBottom: 30
                }}>
                    {articleSource}
                </Text>

                {/* Progress Bar */}
                <View style={{ width: '100%', marginBottom: 20 }}>
                    <View
                        style={{
                            height: 32,
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                height: 4,
                                backgroundColor: '#333',
                                borderRadius: 2,
                                position: 'relative',
                            }}
                        >
                            <View
                                style={{
                                    height: '100%',
                                    width: `${progressPercent}%`,
                                    backgroundColor: '#fff',
                                    borderRadius: 2,
                                }}
                            />
                            <View
                                style={{
                                    position: 'absolute',
                                    left: `${progressPercent}%`,
                                    top: -4,
                                    width: 12,
                                    height: 12,
                                    backgroundColor: '#fff',
                                    borderRadius: 6,
                                    marginLeft: -6,
                                }}
                            />
                        </View>
                    </View>

                    {/* Time indicators */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 8
                    }}>
                        <Text style={{ color: '#999', fontSize: 14 }}>
                            {formatTime(currentPosition)}
                        </Text>
                        <Text style={{ color: '#999', fontSize: 14 }}>
                            {formatRemainingTime(currentPosition, currentDuration)}
                        </Text>
                    </View>
                </View>

                {/* Playback Controls */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: 40
                }}>
                    {/* Rewind 15s */}
                    <TouchableOpacity
                        onPress={handleBackward}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{
                                color: '#fff',
                                fontSize: 12,
                                fontWeight: 'bold'
                            }}>15</Text>
                            <Ionicons
                                name="play-back"
                                size={16}
                                color="#fff"
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Play/Pause */}
                    <TouchableOpacity onPress={handlePlayPause} style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {isAudioLoading ? (
                            <View style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="small" color="#000" />
                            </View>
                        ) : (
                            <Ionicons
                                name={currentIsPlaying ? "pause" : "play"}
                                size={32}
                                color="#000"
                            />
                        )}
                    </TouchableOpacity>

                    {/* Forward 15s */}
                    <TouchableOpacity
                        onPress={handleForward}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{
                                color: '#fff',
                                fontSize: 12,
                                fontWeight: 'bold'
                            }}>15</Text>
                            <Ionicons
                                name="play-forward"
                                size={16}
                                color="#fff"
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Bottom Controls */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    {/* Speed */}
                    <TouchableOpacity onPress={handleSpeedChange} style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: '#fff', fontSize: 16, marginRight: 8 }}>
                            {speedOptions[speedIndex].toFixed(1)}x
                        </Text>
                    </TouchableOpacity>

                    {/* Voice Settings */}
                    <TouchableOpacity onPress={handleVoiceChange} style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Ionicons name="person" size={20} color="#fff" />
                    </TouchableOpacity>

                    {/* Cast */}
                    <TouchableOpacity style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Ionicons name="radio" size={20} color="#fff" />
                    </TouchableOpacity>

                    {/* Sleep Timer */}
                    <TouchableOpacity onPress={handleSleepTimer} style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Ionicons name="moon" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
