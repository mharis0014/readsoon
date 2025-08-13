import { useCallback, useRef } from 'react';
import { TTSState } from '../types/tts';

export const useTTSTimer = (state: TTSState, setState: React.Dispatch<React.SetStateAction<TTSState>>) => {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(0);

    const startTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        startTimeRef.current = Date.now() - (state.position * 1000);

        intervalRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            setState(prev => ({
                ...prev,
                position: elapsed
            }));
        }, 100);
    }, [setState, state.position]);

    const stopTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    return { startTimer, stopTimer };
};
