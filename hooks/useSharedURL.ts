import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useArticles } from '../context/ArticleContext';
import { useHybridUser } from '../context/HybridUserContext';

export function useSharedURL() {
    const [isProcessing, setIsProcessing] = useState(false);
    const { extractAndSaveArticle } = useArticles();
    const { user } = useHybridUser();

    const processSharedURL = async () => {
        if (!user) return;

        try {
            // Check for shared URL in UserDefaults (iOS)
            const sharedDefaults = await import('@react-native-async-storage/async-storage');
            const sharedURL = await sharedDefaults.default.getItem('sharedURL');
            const timestamp = await sharedDefaults.default.getItem('sharedURLTimestamp');

            if (sharedURL && timestamp) {
                const urlTimestamp = parseInt(timestamp, 10);
                const currentTime = Date.now();
                const timeDiff = currentTime - urlTimestamp;

                // Only process URLs that were shared within the last 5 minutes
                if (timeDiff < 5 * 60 * 1000) {
                    setIsProcessing(true);

                    try {
                        await extractAndSaveArticle(sharedURL);

                        // Clear the shared URL after processing
                        await sharedDefaults.default.removeItem('sharedURL');
                        await sharedDefaults.default.removeItem('sharedURLTimestamp');
                    } catch (error) {
                        console.error('Error processing shared URL:', error);
                    } finally {
                        setIsProcessing(false);
                    }
                } else {
                    // Clear old shared URLs
                    await sharedDefaults.default.removeItem('sharedURL');
                    await sharedDefaults.default.removeItem('sharedURLTimestamp');
                }
            }
        } catch (error) {
            console.error('Error checking for shared URLs:', error);
        }
    };

    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active' && user) {
                processSharedURL();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Process any existing shared URLs when the hook is first used
        if (user) {
            processSharedURL();
        }

        return () => {
            subscription?.remove();
        };
    }, [user]);

    return {
        isProcessing,
        processSharedURL
    };
} 