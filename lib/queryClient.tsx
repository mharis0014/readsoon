import React from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, focusManager, onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider, PersistQueryClientProviderProps } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Tune these to your UX:
            staleTime: 1000 * 60 * 5,          // 5 min: list/detail won't refetch just by navigating
            gcTime: 1000 * 60 * 60 * 24,     // 24h
            refetchOnWindowFocus: true,        // on app foreground
            refetchOnReconnect: true,
            retry: 2,
        },
        mutations: {
            retry: 1,
        }
    }
});

// React to app foreground for refetch-on-focus
focusManager.setEventListener((handleFocus) => {
    const onChange = (state: string) => handleFocus(state === 'active');
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
});

// React to network changes
onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
        setOnline(Boolean(state.isConnected && state.isInternetReachable));
    });
});

// Persistence
const persister = createAsyncStoragePersister({
    storage: AsyncStorage,
    key: 'RQ_CACHE_v1',
    throttleTime: 1000,
});

export const withPersistedQueryClient = (props: Omit<PersistQueryClientProviderProps, 'client' | 'persistOptions'>) => {
    return (
        <PersistQueryClientProvider
      client= { queryClient }
    persistOptions = {{ persister, dehydrateOptions: { shouldDehydrateQuery: () => true } }
}
{...props }
    />
  );
};
