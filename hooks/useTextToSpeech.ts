import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export interface TTSState {
    isPlaying: boolean;
    isPaused: boolean;
    position: number;
    duration: number;
    speed: number;
    voice: string | null;
    availableVoices: Speech.Voice[];
    remainingText?: string;
    seekPosition?: number;
    error?: string;
}

export interface TTSSettings {
    speed: number;
    voice: string | null;
    pitch: number;
    volume: number;
}

const DEFAULT_SETTINGS: TTSSettings = {
    speed: 1.0,
    voice: null,
    pitch: 1.0,
    volume: 1.0,
};

// Helper function to find a female voice
const findFemaleVoice = (voices: Speech.Voice[]): string | null => {
    // Common female voice identifiers
    const femaleKeywords = [
        'female', 'woman', 'girl', 'samantha', 'victoria', 'alex', 'karen',
        'helena', 'susan', 'nancy', 'lisa', 'sarah', 'emma', 'olivia',
        'ava', 'isabella', 'sophia', 'charlotte', 'mia', 'amelia'
    ];

    // First, try to find voices with explicit female identifiers
    for (const voice of voices) {
        const voiceName = voice.name?.toLowerCase() || '';

        if (femaleKeywords.some(keyword => voiceName.includes(keyword))) {
            return voice.identifier;
        }
    }

    // If no explicit female voice found, try to find voices that are commonly female
    // based on language and region
    for (const voice of voices) {
        const voiceLanguage = voice.language?.toLowerCase() || '';

        // Some languages have gender-specific voice patterns
        if (voiceLanguage.includes('en-us') || voiceLanguage.includes('en-gb')) {
            // For English, try to find voices that are typically female
            const voiceName = voice.name?.toLowerCase() || '';
            if (voiceName.includes('enhanced') || voiceName.includes('premium')) {
                return voice.identifier;
            }
        }
    }

    // If still no female voice found, return the first available voice
    return voices.length > 0 ? voices[0].identifier : null;
};

// Android-specific TTS helper
const androidTTSSpeak = async (text: string, options: any): Promise<void> => {
    try {
        // For Android, try multiple approaches
        if (Platform.OS === 'android') {
            // Approach 1: Try with voice specification
            if (options.voice) {
                try {
                    await Speech.speak(text, {
                        ...options,
                        voice: options.voice
                    });
                    return;
                } catch (voiceError) {
                    console.warn('Android voice error, trying without voice:', voiceError);
                }
            }

            // Approach 2: Try without voice specification
            try {
                await Speech.speak(text, {
                    ...options,
                    voice: undefined
                });
                return;
            } catch (noVoiceError) {
                console.warn('Android no-voice error, trying minimal options:', noVoiceError);
            }

            // Approach 3: Try with minimal options
            try {
                await Speech.speak(text, {
                    rate: options.rate || 1.0,
                    pitch: options.pitch || 1.0,
                    volume: options.volume || 1.0,
                });
                return;
            } catch (minimalError) {
                console.warn('Android minimal options error:', minimalError);
            }

            // Approach 4: Try with just text
            try {
                await Speech.speak(text);
                return;
            } catch (textOnlyError) {
                console.error('Android text-only error:', textOnlyError);
                throw textOnlyError;
            }
        }

        // Default behavior for iOS
        await Speech.speak(text, options);
    } catch (error) {
        console.error('TTS speak error:', error);
        throw error;
    }
};

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

    const [settings, setSettings] = useState<TTSSettings>(DEFAULT_SETTINGS);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(0);

    // Load available voices and select a female voice
    useEffect(() => {
        const loadVoices = async () => {
            try {
                const voices = await Speech.getAvailableVoicesAsync();
                // For Android, be more conservative with voice selection
                let femaleVoice = null;
                if (Platform.OS === 'android') {
                    // On Android, try to find a simple English voice
                    femaleVoice = voices.find(v =>
                        v.language?.includes('en') &&
                        !v.name?.includes('male') &&
                        !v.name?.includes('guy')
                    )?.identifier || voices[0]?.identifier;
                } else {
                    femaleVoice = findFemaleVoice(voices);
                }

                setState(prev => ({
                    ...prev,
                    availableVoices: voices,
                    voice: femaleVoice
                }));

                setSettings(prev => ({ ...prev, voice: femaleVoice }));
            } catch (error) {
                console.warn('Failed to load voices:', error);
                // Continue without voice selection
                setState(prev => ({ ...prev, error: 'Failed to load voices' }));
            }
        };

        loadVoices();
    }, []);

    // Calculate estimated duration based on text length and speed
    useEffect(() => {
        if (text) {
            const wordsPerMinute = 150; // Average reading speed
            const wordCount = text.split(' ').length;
            const estimatedMinutes = wordCount / wordsPerMinute;
            const estimatedSeconds = estimatedMinutes * 60 / settings.speed;
            setState(prev => ({ ...prev, duration: estimatedSeconds }));
        }
    }, [text, settings.speed]);

    const startTimer = useCallback(() => {
        startTimeRef.current = Date.now() - (state.position * 1000);

        intervalRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            setState(prev => ({
                ...prev,
                position: Math.min(elapsed, prev.duration),
            }));
        }, 100);
    }, [state.position]);

    const stopTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const speak = useCallback(async () => {
        if (!text) return;

        try {
            // Use remaining text if available (from seek), otherwise use full text
            const textToSpeak = state.remainingText || text;

            // Clear any previous errors
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
                        // If using remaining text, start timer from seek position
                        position: state.seekPosition || 0,
                        error: undefined
                    }));
                    startTimer();
                },
                onDone: () => {
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
    }, [text, state.remainingText, state.seekPosition, settings, startTimer, stopTimer]);

    const pause = useCallback(async () => {
        try {
            Speech.stop();
            setState(prev => ({ ...prev, isPaused: true, isPlaying: false }));
            stopTimer();
        } catch (error) {
            console.error('Failed to pause speech:', error);
        }
    }, [stopTimer]);

    const resume = useCallback(async () => {
        try {
            // Use remaining text if available, otherwise calculate from current position
            let textToResume = state.remainingText;

            if (!textToResume) {
                // Calculate remaining text from current position
                const wordsPerMinute = 150;
                const wordsPerSecond = wordsPerMinute / 60;
                const wordsToSkip = Math.floor(state.position * wordsPerSecond);
                const words = text.split(' ');
                const remainingWords = words.slice(wordsToSkip);
                textToResume = remainingWords.join(' ');
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
        // Stop current speech
        Speech.stop();
        stopTimer();

        // Update position
        setState(prev => ({
            ...prev,
            position: newPosition,
            isPlaying: false,
            isPaused: false
        }));

        // If we want to resume from this position, we need to calculate the text offset
        // This is an approximation based on average reading speed
        const wordsPerMinute = 150;
        const wordsPerSecond = wordsPerMinute / 60;
        const wordsToSkip = Math.floor(newPosition * wordsPerSecond);

        // Split text into words and skip the appropriate number
        const words = text.split(' ');
        const remainingWords = words.slice(wordsToSkip);
        const remainingText = remainingWords.join(' ');

        // Store the remaining text for resume functionality
        setState(prev => ({
            ...prev,
            remainingText: remainingText,
            seekPosition: newPosition
        }));
    }, [text, stopTimer]);

    const updateSpeed = useCallback((newSpeed: number) => {
        setSettings(prev => ({ ...prev, speed: newSpeed }));
        setState(prev => ({ ...prev, speed: newSpeed }));

        // If currently playing, restart with new speed
        if (state.isPlaying) {
            stop().then(() => {
                setTimeout(() => speak(), 100);
            });
        }
    }, [state.isPlaying, stop, speak]);

    const updateVoice = useCallback((newVoice: string | null) => {
        setSettings(prev => ({ ...prev, voice: newVoice }));
        setState(prev => ({ ...prev, voice: newVoice }));
    }, []);

    const setVoice = useCallback((voice: string) => {
        updateVoice(voice);
    }, [updateVoice]);

    const updatePitch = useCallback((newPitch: number) => {
        setSettings(prev => ({ ...prev, pitch: newPitch }));
    }, []);

    const updateVolume = useCallback((newVolume: number) => {
        setSettings(prev => ({ ...prev, volume: newVolume }));
    }, []);

    // Check if TTS is available
    const checkTTSAvailability = useCallback(async () => {
        try {
            const voices = await Speech.getAvailableVoicesAsync();
            return voices.length > 0;
        } catch (error) {
            console.warn('TTS not available:', error);
            return false;
        }
    }, []);

    // Get current voice name for display
    const getCurrentVoiceName = useCallback(() => {
        if (!settings.voice) return 'Default';
        const voice = state.availableVoices.find(v => v.identifier === settings.voice);
        return voice?.name || 'Unknown';
    }, [settings.voice, state.availableVoices]);

    // Get available female voices
    const getFemaleVoices = useCallback(() => {
        return state.availableVoices.filter(voice => {
            const voiceName = voice.name?.toLowerCase() || '';
            const femaleKeywords = [
                'female', 'woman', 'girl', 'samantha', 'victoria', 'alex', 'karen',
                'helena', 'susan', 'nancy', 'lisa', 'sarah', 'emma', 'olivia',
                'ava', 'isabella', 'sophia', 'charlotte', 'mia', 'amelia'
            ];
            return femaleKeywords.some(keyword => voiceName.includes(keyword));
        });
    }, [state.availableVoices]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopTimer();
            Speech.stop();
        };
    }, [stopTimer]);

    return {
        state,
        settings,
        speak,
        pause,
        resume,
        stop,
        seek,
        updateSpeed,
        updateVoice,
        updatePitch,
        updateVolume,
        getCurrentVoiceName,
        getFemaleVoices,
        checkTTSAvailability,
        setVoice: updateVoice,
    };
} 