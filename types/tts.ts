import * as Speech from 'expo-speech';

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
    isPausing?: boolean;
}

export interface TTSSettings {
    speed: number;
    voice: string | null;
    pitch: number;
    volume: number;
}

export const DEFAULT_SETTINGS: TTSSettings = {
    speed: 1.0,
    voice: null,
    pitch: 1.0,
    volume: 1.0,
};
