import { typography } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { AudioPlayer, setAudioModeAsync } from 'expo-audio';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { TTSService } from '../../services/ttsService';
import { articleDetailStyles as styles } from '../../styles/article-detail';

interface ArticleBottomNavProps {
    onShare: () => void;
    onOpenInBrowser: () => void;
    articleContent: string;

    // Reader mode
    isReadingMode?: boolean;
    onToggleReadingMode?: () => void;
}

type TTSState = 'idle' | 'loading' | 'playing' | 'paused';

export default function ArticleBottomNav({
    onShare,
    onOpenInBrowser,
    articleContent,
    isReadingMode = false,
    onToggleReadingMode
}: ArticleBottomNavProps) {
    const [ttsState, setTtsState] = useState<TTSState>('idle');
    const audioRef = useRef<AudioPlayer | null>(null);

    useEffect(() => {
        const setupAudio = async () => {
            try {
                await setAudioModeAsync({
                    playsInSilentMode: true,
                    shouldPlayInBackground: true,
                    shouldRouteThroughEarpiece: false,
                });
            } catch (error) {
                console.error('Error setting up audio mode:', error);
            }
        };
        setupAudio();
        return () => { if (audioRef.current) audioRef.current.release(); };
    }, []);

    const handlePlayPress = async () => {
        if (ttsState === 'idle') {
            try {
                setTtsState('loading');
                const player = await TTSService.generateSpeech(articleContent);
                audioRef.current = player;

                player.addListener('playbackStatusUpdate', (status) => {
                    if (status.isLoaded) {
                        if (status.didJustFinish) setTtsState('idle');
                        else if (status.playing) setTtsState('playing');
                        else if (!status.playing && !status.didJustFinish) setTtsState('paused');
                    }
                });

                player.play();
                setTtsState('playing');
            } catch (error) {
                console.error('Error playing TTS:', error);
                setTtsState('idle');
            }
        } else if (ttsState === 'paused') {
            try { audioRef.current?.play(); setTtsState('playing'); } catch { }
        }
    };

    const handlePausePress = async () => {
        if (audioRef.current && ttsState === 'playing') {
            try { audioRef.current.pause(); setTtsState('paused'); } catch { }
        }
    };

    const handleRestartPress = async () => {
        if (audioRef.current) {
            try { await audioRef.current.seekTo(0); audioRef.current.play(); setTtsState('playing'); } catch { }
        }
    };

    const handleStopPress = async () => {
        if (audioRef.current) {
            try { audioRef.current.pause(); audioRef.current.release(); audioRef.current = null; setTtsState('idle'); } catch { }
        }
    };

    const renderTTSControls = () => {
        if (ttsState === 'loading') {
            return (
                <View style={styles.ttsLoadingContainer}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                    <Text style={styles.ttsLoadingText}>Loading voice...</Text>
                </View>
            );
        }
        if (ttsState === 'playing' || ttsState === 'paused') {
            return (
                <View style={styles.ttsControlsContainer}>
                    <TouchableOpacity
                        onPress={ttsState === 'playing' ? handlePausePress : handlePlayPress}
                        style={{ backgroundColor: '#22c55e', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Ionicons name={ttsState === 'playing' ? 'pause' : 'play'} size={24} color={Colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleRestartPress}
                        style={{ backgroundColor: '#f97316', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Ionicons name="refresh" size={24} color={Colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleStopPress}
                        style={{ backgroundColor: '#ef4444', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Ionicons name="stop" size={24} color={Colors.white} />
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    };

    return (
        <View style={styles.bottomNav}>
            {ttsState === 'idle' ? (
                <>
                    <TouchableOpacity style={styles.navButton} onPress={handlePlayPress}>
                        <Ionicons name="play-outline" size={typography.xxl} color="#6b7280" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navButton} onPress={onOpenInBrowser}>
                        <Ionicons name="compass-outline" size={typography.xxl} color="#6b7280" />
                    </TouchableOpacity>

                    {/* Reader Mode toggle (book icon) */}
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={onToggleReadingMode}
                        accessibilityLabel="Toggle reading mode"
                    >
                        <Ionicons
                            name={isReadingMode ? 'book' : 'book-outline'}
                            size={typography.xxl}
                            color={isReadingMode ? Colors.primary : '#6b7280'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navButton} onPress={onShare}>
                        <Ionicons name="share-social-outline" size={typography.xxl} color="#6b7280" />
                    </TouchableOpacity>
                </>
            ) : (
                renderTTSControls()
            )}
        </View>
    );
}
