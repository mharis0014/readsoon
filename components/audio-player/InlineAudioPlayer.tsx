import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useTTS } from '../../context/TTSContext';

interface InlineAudioPlayerProps {
    articleContent: string;
    articleTitle: string;
    articleAuthor: string;
    articleImage?: any;
    onClose: () => void;
}

export default function InlineAudioPlayer({
    articleContent,
    articleTitle,
    articleAuthor,
    articleImage,
    onClose
}: InlineAudioPlayerProps) {
    const router = useRouter();
    const {
        state: ttsState,
        speak,
        pause,
        resume,
        stop,
        seek,
        setCurrentText
    } = useTTS();

    const currentIsPlaying = ttsState.isPlaying;

    // Set current text and auto-play audio when component mounts
    useEffect(() => {
        if (articleContent && articleContent.trim().length > 0) {
            setCurrentText(articleContent);

            if (!currentIsPlaying && !ttsState.isPaused) {
                // Small delay to ensure the component is fully mounted
                const timer = setTimeout(() => {
                    speak().catch((error: any) => {
                        console.error('Auto-play failed:', error);
                    });
                }, 500);

                return () => clearTimeout(timer);
            }
        }
    }, [articleContent, currentIsPlaying, ttsState.isPaused, speak, setCurrentText]);

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
            console.error('TTS control error:', error);
        }
    };

    const handleFastBackward = () => {
        const currentPosition = ttsState.isPaused ? (ttsState.seekPosition || ttsState.position) : ttsState.position;
        const newPosition = Math.max(currentPosition - 15, 0);
        console.log('Fast backward:', { currentPosition, newPosition, duration: ttsState.duration });
        seek(newPosition);
    };

    const handleFastForward = () => {
        const currentPosition = ttsState.isPaused ? (ttsState.seekPosition || ttsState.position) : ttsState.position;
        // Use a reasonable maximum duration if ttsState.duration is 0
        const maxDuration = ttsState.duration > 0 ? ttsState.duration : 3600; // 1 hour as fallback
        const newPosition = Math.min(currentPosition + 15, maxDuration);
        console.log('Fast forward:', { currentPosition, newPosition, duration: ttsState.duration, maxDuration });
        seek(newPosition);
    };

    const handleOpenFullScreen = () => {
        // Store the image globally so TTS screen can access it
        (global as any).currentArticleImage = articleImage;

        router.push({
            pathname: '/text-to-speech',
            params: {
                content: articleContent,
                title: articleTitle,
                source: articleAuthor
            }
        });
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={handleOpenFullScreen}>
                <BlurView intensity={20} tint="light" style={styles.blurContainer}>
                    {/* Album Art */}
                    <View style={styles.albumArtContainer}>
                        {articleImage ? (
                            <Image
                                source={articleImage}
                                style={styles.albumArt}
                                contentFit="cover"
                            />
                        ) : (
                            <View style={styles.placeholderArt}>
                                <Text style={styles.placeholderText}>
                                    {articleTitle.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Audio Information */}
                    <View style={styles.audioInfo}>
                        <Text style={styles.title} numberOfLines={1}>
                            {articleTitle}
                        </Text>
                        <Text style={styles.author} numberOfLines={1}>
                            {articleAuthor}
                        </Text>
                    </View>

                    {/* Playback Controls */}
                    <View style={styles.controls}>
                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                handleFastBackward();
                            }}
                            style={styles.controlButton}
                        >
                            <Ionicons name="play-back" size={20} color="#666" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                handlePlayPause();
                            }}
                            style={styles.playButton}
                        >
                            <Ionicons
                                name={currentIsPlaying ? "pause" : "play"}
                                size={24}
                                color="#fff"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                handleFastForward();
                            }}
                            style={styles.controlButton}
                        >
                            <Ionicons name="play-forward" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 90,
        left: 16,
        right: 16,
        zIndex: 1000,
        borderRadius: 12,
    },
    blurContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    albumArtContainer: {
        marginRight: 12,
    },
    albumArt: {
        width: 48,
        height: 48,
        borderRadius: 8,
    },
    placeholderArt: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
    },
    audioInfo: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    author: {
        fontSize: 12,
        color: '#666',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    controlButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ff6b35',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#ff6b35',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
});
