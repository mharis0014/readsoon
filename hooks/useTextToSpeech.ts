import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TTSState, TTSSettings, DEFAULT_SETTINGS } from '../types/tts';
import { findFemaleVoice } from '../utils/voiceUtils';
import { androidTTSSpeak, calculateRemainingText } from '../utils/ttsHelpers';
import { useTTSTimer } from './useTTSTimer';

export function useTextToSpeech(text: string) {
    const [state, setState] = useState<TTSState>({
        isPlaying: false,
        isPaused: false,
        position: 0,
        duration: 0,
        speed: DEFAULT_SETTINGS.speed,
        voice: DEFAULT_SETTINGS.voice,
        availableVoices: [],
        error: undefined,
    });

    // Use ref to track pausing state to avoid timing issues
    const isPausingRef = useRef(false);

    const [settings, setSettings] = useState<TTSSettings>(DEFAULT_SETTINGS);
    const { startTimer, stopTimer } = useTTSTimer(state, setState);

    // Load available voices
    useEffect(() => {
        const loadVoices = async () => {
            try {
                const voices = await Speech.getAvailableVoicesAsync();
                setState(prev => ({ ...prev, availableVoices: voices }));

                // Auto-select a female voice if available
                const femaleVoice = findFemaleVoice(voices);
                if (femaleVoice) {
                    setSettings(prev => ({ ...prev, voice: femaleVoice }));
                }
            } catch (error) {
                console.error('Failed to load voices:', error);
            }
        };

        loadVoices();
    }, []);

    const speak = useCallback(async () => {
        if (!text) return;

        try {
            const textToSpeak = state.remainingText || text;
            setState(prev => ({ ...prev, error: undefined }));

            await androidTTSSpeak(textToSpeak, {
                rate: settings.speed,
                pitch: settings.pitch,
                volume: settings.volume,
                voice: settings.voice || undefined,
                onStart: () => {
                    setState(prev => ({
                        ...prev,
                        isPlaying: true,
                        isPaused: false,
                        position: prev.seekPosition || prev.position || 0,
                        error: undefined
                    }));
                    startTimer();
                },
                onDone: () => {
                    if (isPausingRef.current) {
                        return;
                    }

                    setState(prev => ({
                        ...prev,
                        isPlaying: false,
                        isPaused: false,
                        position: 0,
                        remainingText: undefined,
                        seekPosition: undefined,
                        error: undefined
                    }));
                    stopTimer();
                },
                onStopped: () => {
                    if (isPausingRef.current) {
                        isPausingRef.current = false;
                        return;
                    }

                    setState(prev => ({
                        ...prev,
                        isPlaying: false,
                        isPaused: false,
                        remainingText: undefined,
                        seekPosition: undefined,
                        error: undefined
                    }));
                    stopTimer();
                },
                onError: (error: any) => {
                    console.error('TTS Error:', error);
                    setState(prev => ({
                        ...prev,
                        isPlaying: false,
                        isPaused: false,
                        remainingText: undefined,
                        seekPosition: undefined,
                        error: error?.message || 'TTS Error'
                    }));
                    stopTimer();
                },
            });
        } catch (error: any) {
            console.error('Failed to start speech:', error);
            setState(prev => ({
                ...prev,
                isPlaying: false,
                isPaused: false,
                error: error?.message || 'Failed to start speech'
            }));
            throw error;
        }
    }, [text, state.remainingText, settings, startTimer, stopTimer]);

    const pause = useCallback(async () => {
        try {
            isPausingRef.current = true;

            const remainingText = calculateRemainingText(text, state.position);

            setState(prev => ({
                ...prev,
                isPaused: true,
                isPlaying: false,
                remainingText: remainingText,
                seekPosition: prev.position
            }));

            Speech.stop();
            stopTimer();
        } catch (error) {
            console.error('Failed to pause speech:', error);
        }
    }, [stopTimer, state.position, text]);

    const resume = useCallback(async () => {
        try {
            let textToResume = state.remainingText;

            if (!textToResume) {
                textToResume = calculateRemainingText(text, state.position);
            }

            if (textToResume) {
                await androidTTSSpeak(textToResume, {
                    rate: settings.speed,
                    pitch: settings.pitch,
                    volume: settings.volume,
                    voice: settings.voice || undefined,
                    onStart: () => {
                        setState(prev => ({
                            ...prev,
                            isPaused: false,
                            isPlaying: true,
                            position: state.seekPosition || state.position
                        }));
                        startTimer();
                    },
                    onDone: () => {
                        if (isPausingRef.current) {
                            return;
                        }

                        setState(prev => ({
                            ...prev,
                            isPlaying: false,
                            isPaused: false,
                            position: 0,
                            remainingText: undefined,
                            seekPosition: undefined
                        }));
                        stopTimer();
                    },
                    onStopped: () => {
                        if (isPausingRef.current) {
                            return;
                        }

                        setState(prev => ({
                            ...prev,
                            isPlaying: false,
                            isPaused: false,
                            remainingText: undefined,
                            seekPosition: undefined
                        }));
                        stopTimer();
                    },
                    onError: (error: any) => {
                        console.error('TTS Error:', error);
                        setState(prev => ({
                            ...prev,
                            isPlaying: false,
                            isPaused: false,
                            remainingText: undefined,
                            seekPosition: undefined
                        }));
                        stopTimer();
                    },
                });
            }
        } catch (error) {
            console.error('Failed to resume speech:', error);
        }
    }, [text, state.remainingText, state.position, state.seekPosition, settings, startTimer, stopTimer]);

    const stop = useCallback(async () => {
        try {
            Speech.stop();
            setState(prev => ({
                ...prev,
                isPlaying: false,
                isPaused: false,
                position: 0,
                remainingText: undefined,
                seekPosition: undefined
            }));
            stopTimer();
        } catch (error) {
            console.error('Failed to stop speech:', error);
        }
    }, [stopTimer]);

    const seek = useCallback((newPosition: number) => {
        const wasPlaying = state.isPlaying;
        Speech.stop();

        const remainingText = calculateRemainingText(text, newPosition);

        setState(prev => ({
            ...prev,
            position: newPosition,
            isPlaying: false,
            isPaused: false,
            remainingText: remainingText,
            seekPosition: newPosition
        }));

        if (wasPlaying) {
            setTimeout(() => {
                speak();
            }, 100);
        }
    }, [text, state.isPlaying, speak]);

    const updateSpeed = useCallback((newSpeed: number) => {
        setSettings(prev => ({ ...prev, speed: newSpeed }));

        if (state.isPlaying || state.isPaused) {
            Speech.stop();

            setTimeout(() => {
                const currentPosition = state.position;
                const remainingText = calculateRemainingText(text, currentPosition);

                androidTTSSpeak(remainingText, {
                    rate: newSpeed,
                    pitch: settings.pitch,
                    volume: settings.volume,
                    voice: settings.voice || undefined,
                    onStart: () => {
                        setState(prev => ({
                            ...prev,
                            isPlaying: true,
                            isPaused: false,
                            position: currentPosition,
                            remainingText: remainingText,
                            error: undefined
                        }));
                        startTimer();
                    },
                    onDone: () => {
                        if (isPausingRef.current) {
                            return;
                        }

                        setState(prev => ({
                            ...prev,
                            isPlaying: false,
                            isPaused: false,
                            position: 0,
                            remainingText: undefined,
                            seekPosition: undefined,
                            error: undefined
                        }));
                        stopTimer();
                    },
                    onStopped: () => {
                        if (isPausingRef.current) {
                            isPausingRef.current = false;
                            return;
                        }

                        setState(prev => ({
                            ...prev,
                            isPlaying: false,
                            isPaused: false,
                            remainingText: undefined,
                            seekPosition: undefined,
                            error: undefined
                        }));
                        stopTimer();
                    },
                    onError: (error: any) => {
                        console.error('TTS Error:', error);
                        setState(prev => ({
                            ...prev,
                            isPlaying: false,
                            isPaused: false,
                            remainingText: undefined,
                            seekPosition: undefined,
                            error: error?.message || 'TTS Error'
                        }));
                        stopTimer();
                    },
                });
            }, 100);
        }
    }, [state.isPlaying, state.isPaused, state.remainingText, text, settings.pitch, settings.volume, settings.voice, startTimer, stopTimer]);

    const updateVoice = useCallback((newVoice: string | null) => {
        setSettings(prev => ({ ...prev, voice: newVoice }));
    }, []);

    const updatePitch = useCallback((newPitch: number) => {
        setSettings(prev => ({ ...prev, pitch: newPitch }));
    }, []);

    const updateVolume = useCallback((newVolume: number) => {
        setSettings(prev => ({ ...prev, volume: newVolume }));
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            Speech.stop();
            stopTimer();
        };
    }, [stopTimer]);

    return {
        state,
        speak,
        pause,
        resume,
        stop,
        seek,
        updateSpeed,
        updateVoice,
        updatePitch,
        updateVolume,
        settings,
    };
}
