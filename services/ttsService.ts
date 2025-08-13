// eslint-disable-next-line import/no-unresolved
import { EXPO_PUBLIC_LEMONFOX_API_KEY } from '@env';
import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import * as FileSystem from 'expo-file-system';

export interface TTSResponse {
    audio: string; // base64 audio data
}

export class TTSService {
    private static base64Encode(str: string): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let output = '';
        let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        let i = 0;

        do {
            chr1 = str.charCodeAt(i++);
            chr2 = str.charCodeAt(i++);
            chr3 = str.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                chars.charAt(enc1) + chars.charAt(enc2) +
                chars.charAt(enc3) + chars.charAt(enc4);
        } while (i < str.length);

        return output;
    }

    private static async convertArrayBufferToBase64(arrayBuffer: ArrayBuffer): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const bytes = new Uint8Array(arrayBuffer);
                let binary = '';
                for (let i = 0; i < bytes.byteLength; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                const base64 = this.base64Encode(binary);
                resolve(base64);
            } catch (error) {
                reject(error);
            }
        });
    }

    private static async convertBase64ToAudio(base64Audio: string): Promise<AudioPlayer> {
        try {
            // Create a temporary file for the audio
            const tempUri = `${FileSystem.cacheDirectory}temp_audio_${Date.now()}.mp3`;

            // Write base64 data to file
            await FileSystem.writeAsStringAsync(tempUri, base64Audio, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Create audio player from file
            const player = createAudioPlayer({ uri: tempUri });

            return player;
        } catch (error) {
            console.error('Error converting base64 to audio:', error);
            throw error;
        }
    }

    static async generateSpeech(text: string): Promise<AudioPlayer> {
        // if (!EXPO_PUBLIC_LEMONFOX_API_KEY) {
        //     throw new Error('Lemonfox API key not configured. Please set EXPO_PUBLIC_LEMONFOX_API_KEY in your environment variables.');
        // }

        try {
            const response = await fetch('https://api.lemonfox.ai/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${EXPO_PUBLIC_LEMONFOX_API_KEY || '0nmXyJmM2ACIK1gKMwz1puWS5DlaNF3Z'}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'eleven_multilingual_v2',
                    voice_id: 'oliver',
                    input: text,
                }),
            });

            if (!response.ok) {
                throw new Error(`TTS API error: ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const base64Audio = await this.convertArrayBufferToBase64(arrayBuffer);

            return await this.convertBase64ToAudio(base64Audio);
        } catch (error) {
            console.error('Error generating speech:', error);
            throw error;
        }
    }
} 