import { useQuery } from '@tanstack/react-query';
import { TTSService } from '../services/ttsService';
import { qk } from '../lib/queryKeys';

export function useAudioCache(text: string) {
    return useQuery({
        queryKey: qk.audioByText(text),
        queryFn: async () => {
            try {
                const audioPlayer = await TTSService.generateSpeech(text);
                return audioPlayer;
            } catch (error) {
                console.error('Error in useAudioCache:', error);
                throw error;
            }
        },
        enabled: !!text && text.trim().length > 0,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
        retry: 2,
    });
}
