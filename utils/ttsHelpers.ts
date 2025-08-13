import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

// Android-specific TTS helper
export const androidTTSSpeak = async (text: string, options: any): Promise<void> => {
    try {
        if (Platform.OS === 'android') {
            // Approach 1: Try with voice specification
            if (options.voice) {
                try {
                    await Speech.speak(text, { ...options, voice: options.voice });
                    return;
                } catch (voiceError) {
                    console.warn('Android voice error, trying without voice:', voiceError);
                }
            }

            // Approach 2: Try without voice specification
            try {
                await Speech.speak(text, { ...options, voice: undefined });
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
                console.warn('Android text-only error:', textOnlyError);
            }

            throw new Error('All Android TTS approaches failed');
        } else {
            // iOS - use standard approach
            await Speech.speak(text, options);
        }
    } catch (error) {
        console.error('TTS speak error:', error);
        throw error;
    }
};

// Calculate remaining text from position
export const calculateRemainingText = (text: string, position: number): string => {
    const wordsPerMinute = 150;
    const wordsPerSecond = wordsPerMinute / 60;
    const wordsToSkip = Math.floor(position * wordsPerSecond);
    const words = text.split(/\s+/);
    const remainingWords = words.slice(wordsToSkip);
    return remainingWords.join(' ');
};
