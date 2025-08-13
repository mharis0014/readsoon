import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, SafeAreaView, Text, View } from 'react-native';

import { AudioPlayerErrorState } from '../components/audio-player/AudioPlayerErrorState';
import { AudioPlayerHeader } from '../components/audio-player/AudioPlayerHeader';
import { AudioPlayerHero } from '../components/audio-player/AudioPlayerHero';
import { AudioWaveform } from '../components/audio-player/AudioWaveform';
import { EnhancedAudioControls } from '../components/audio-player/EnhancedAudioControls';
import { useArticles } from '../context/ArticleContext';
import { useAudioPlayerTheme } from '../hooks/useAudioPlayerTheme';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { audioPlayerStyles } from '../styles/audio-player';

export default function TextToSpeechScreen() {
    const { currentArticle } = useArticles();
    const router = useRouter();
    const {
        backgroundColor,
        textColor,
        subtitleColor,
        iconColor,
        accentColor,
        inactiveColor
    } = useAudioPlayerTheme();

    const [speedIndex, setSpeedIndex] = useState(1); // 0.5x, 1x, 1.5x, 2x
    const [isLoading, setIsLoading] = useState(false);
    const [ttsAvailable, setTtsAvailable] = useState(true);
    const speedOptions = [0.5, 1.0, 1.5, 2.0];

    // Use the TTS hook with article content
    const {
        state,
        speak,
        pause,
        resume,
        stop,
        seek,
        updateSpeed,
        getCurrentVoiceName,
        getFemaleVoices,
        checkTTSAvailability,
        setVoice,
    } = useTextToSpeech(currentArticle?.content || '');

    // Check TTS availability on Android
    useEffect(() => {
        const checkAvailability = async () => {
            if (Platform.OS === 'android') {
                const available = await checkTTSAvailability();
                setTtsAvailable(available);

                if (!available) {
                    Alert.alert(
                        'Text-to-Speech Not Available',
                        'Text-to-speech is not available on this device. Please check your device settings or install a TTS engine.',
                        [{ text: 'OK' }]
                    );
                }
            }
        };

        checkAvailability();
    }, [checkTTSAvailability]);

    const handlePlayPause = async () => {
        if (!currentArticle?.content) {
            Alert.alert('No Content', 'This article has no content to read.');
            return;
        }

        if (currentArticle.content.trim().length === 0) {
            Alert.alert('Empty Content', 'This article has no readable content.');
            return;
        }

        if (!ttsAvailable) {
            Alert.alert(
                'Text-to-Speech Not Available',
                'Text-to-speech is not available on this device. Please check your device settings.',
                [{ text: 'OK' }]
            );
            return;
        }

        setIsLoading(true);

        try {
            if (state.isPlaying) {
                pause();
            } else if (state.isPaused) {
                resume();
            } else {
                await speak();
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'Failed to control audio playback';
            Alert.alert(
                'Audio Error',
                `${errorMessage}\n\nPlease try again or check your device's text-to-speech settings.`,
                [{ text: 'OK' }]
            );
            console.error('Audio control error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSeek = (newPosition: number) => {
        if (state.duration > 0) {
            seek(newPosition);
        }
    };

    const handleForward = () => {
        const newPosition = Math.min(state.position + 30, state.duration);
        seek(newPosition);
    };

    const handleBackward = () => {
        const newPosition = Math.max(state.position - 15, 0);
        seek(newPosition);
    };

    const handleSpeedChange = () => {
        const nextSpeedIndex = (speedIndex + 1) % speedOptions.length;
        const newSpeed = speedOptions[nextSpeedIndex];
        setSpeedIndex(nextSpeedIndex);
        updateSpeed(newSpeed);
    };

    const handleVoiceChange = () => {
        const femaleVoices = getFemaleVoices();
        if (femaleVoices.length > 1) {
            // Find current voice index and cycle to next
            const currentIndex = femaleVoices.findIndex(v => v.identifier === state.voice);
            const nextIndex = (currentIndex + 1) % femaleVoices.length;
            const nextVoice = femaleVoices[nextIndex];
            setVoice(nextVoice.identifier);
        } else {
            Alert.alert(
                'Voice Selection',
                `Current voice: ${getCurrentVoiceName()}\n\nOnly one female voice available on this device.`,
                [{ text: 'OK' }]
            );
        }
    };

    const handleSleepTimer = () => {
        Alert.alert(
            'Sleep Timer',
            'Sleep timer functionality will be implemented in a future update.',
            [{ text: 'OK' }]
        );
    };

    const handleClose = () => {
        stop();
        router.back();
    };

    const handleMore = () => {
        Alert.alert(
            'Voice Settings',
            `Current Voice: ${getCurrentVoiceName()}\nSpeed: ${speedOptions[speedIndex]}x\n\nVoice selection and additional options will be available in a future update.`,
            [{ text: 'OK' }]
        );
    };

    const blurTint = backgroundColor === '#f8f8f8' ? 'light' : 'dark';

    if (!currentArticle) {
        return (
            <SafeAreaView style={[audioPlayerStyles.container, { backgroundColor }]}>
                <StatusBar style={backgroundColor === '#f8f8f8' ? 'dark' : 'light'} />
                <AudioPlayerErrorState
                    title="No Article Selected"
                    message="Please select an article to start listening."
                    onRetry={handleClose}
                    textColor={textColor}
                    subtitleColor={subtitleColor}
                    iconColor={iconColor}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[audioPlayerStyles.container, { backgroundColor }]}>
            <StatusBar style={backgroundColor === '#f8f8f8' ? 'dark' : 'light'} />

            <AudioPlayerHeader
                onClose={handleClose}
                onMore={handleMore}
                textColor={textColor}
                blurTint={blurTint}
            />

            <View style={audioPlayerStyles.content}>
                <AudioPlayerHero
                    article={currentArticle}
                    textColor={textColor}
                    subtitleColor={subtitleColor}
                />

                {/* Voice Information */}
                <View style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    alignItems: 'center'
                }}>
                    <Text style={{
                        color: subtitleColor,
                        fontSize: 14,
                        textAlign: 'center'
                    }}>
                        Voice: {getCurrentVoiceName()} • Speed: {speedOptions[speedIndex]}x
                    </Text>
                </View>

                <AudioWaveform
                    position={state.position}
                    duration={state.duration}
                    onSeek={handleSeek}
                    accentColor={accentColor}
                    inactiveColor={inactiveColor}
                />
            </View>

            <EnhancedAudioControls
                isPlaying={state.isPlaying}
                duration={state.duration}
                position={state.position}
                onPlayPause={handlePlayPause}
                onSeek={handleSeek}
                onForward={handleForward}
                onBackward={handleBackward}
                onSpeedChange={handleSpeedChange}
                onSleepTimer={handleSleepTimer}
                textColor={textColor}
                accentColor={accentColor}
                blurTint={blurTint}
                isLoading={isLoading}
            />
        </SafeAreaView>
    );
} 