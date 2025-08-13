import * as SecureStore from 'expo-secure-store';

// Storage keys
export const STORAGE_KEYS = {
    IS_FIRST_LAUNCH: 'is_first_launch',
    USER_TOKEN: 'user_token',
    USER_DATA: 'user_data',
    APP_SETTINGS: 'app_settings',
    ONBOARDING_COMPLETED: 'onboarding_completed',
    WELCOME_SEEN: 'welcome_seen',
    SEARCH_HISTORY: 'search_history',
    REMEMBER_ME: 'remember_me',
    SAVED_EMAIL: 'saved_email',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Simple secure storage helper
 */
export class SecureStorage {
    /**
     * Store a value securely
     */
    static async set(key: StorageKey, value: string): Promise<void> {
        await SecureStore.setItemAsync(key, value);
    }

    /**
     * Store an object securely (serialized as JSON)
     */
    static async setObject<T>(key: StorageKey, value: T): Promise<void> {
        const jsonValue = JSON.stringify(value);
        await SecureStore.setItemAsync(key, jsonValue);
    }

    /**
     * Get a value from secure storage
     */
    static async get(key: StorageKey): Promise<string | null> {
        return await SecureStore.getItemAsync(key);
    }

    /**
     * Get an object from secure storage (deserialized from JSON)
     */
    static async getObject<T>(key: StorageKey): Promise<T | null> {
        const jsonValue = await SecureStore.getItemAsync(key);
        if (!jsonValue) return null;
        return JSON.parse(jsonValue) as T;
    }

    /**
     * Delete a value from secure storage
     */
    static async delete(key: StorageKey): Promise<void> {
        await SecureStore.deleteItemAsync(key);
    }

    /**
     * Check if a key exists in secure storage
     */
    static async has(key: StorageKey): Promise<boolean> {
        const value = await SecureStore.getItemAsync(key);
        return value !== null;
    }

    /**
     * Clear all secure storage
     */
    static async clear(): Promise<void> {
        const keys = Object.values(STORAGE_KEYS);
        await Promise.all(keys.map(key => SecureStore.deleteItemAsync(key)));
    }
}

/**
 * Simple convenience functions
 */
export const StorageHelpers = {
    /**
     * Check if this is the first launch of the app
     */
    async isFirstLaunch(): Promise<boolean> {
        const hasLaunched = await SecureStorage.has(STORAGE_KEYS.IS_FIRST_LAUNCH);
        if (!hasLaunched) {
            await SecureStorage.set(STORAGE_KEYS.IS_FIRST_LAUNCH, 'false');
            return true;
        }
        return false;
    },

    /**
     * Store user authentication token
     */
    async setUserToken(token: string): Promise<void> {
        await SecureStorage.set(STORAGE_KEYS.USER_TOKEN, token);
    },

    /**
     * Get user authentication token
     */
    async getUserToken(): Promise<string | null> {
        return await SecureStorage.get(STORAGE_KEYS.USER_TOKEN);
    },

    /**
     * Store user data
     */
    async setUserData(userData: any): Promise<void> {
        await SecureStorage.setObject(STORAGE_KEYS.USER_DATA, userData);
    },

    /**
     * Get user data
     */
    async getUserData<T = any>(): Promise<T | null> {
        return await SecureStorage.getObject<T>(STORAGE_KEYS.USER_DATA);
    },

    /**
     * Store app settings
     */
    async setAppSettings(settings: any): Promise<void> {
        await SecureStorage.setObject(STORAGE_KEYS.APP_SETTINGS, settings);
    },

    /**
     * Get app settings
     */
    async getAppSettings<T = any>(): Promise<T | null> {
        return await SecureStorage.getObject<T>(STORAGE_KEYS.APP_SETTINGS);
    },

    /**
     * Clear user data (logout)
     */
    async clearUserData(): Promise<void> {
        await SecureStorage.delete(STORAGE_KEYS.USER_TOKEN);
        await SecureStorage.delete(STORAGE_KEYS.USER_DATA);
    },

    /**
     * Store search history
     */
    async setSearchHistory(history: string[]): Promise<void> {
        await SecureStorage.setObject(STORAGE_KEYS.SEARCH_HISTORY, history);
    },

    /**
     * Get search history
     */
    async getSearchHistory(): Promise<string[] | null> {
        return await SecureStorage.getObject<string[]>(STORAGE_KEYS.SEARCH_HISTORY);
    },

    /**
     * Clear search history
     */
    async clearSearchHistory(): Promise<void> {
        await SecureStorage.delete(STORAGE_KEYS.SEARCH_HISTORY);
    },

    /**
     * Mark onboarding as completed
     */
    async setOnboardingCompleted(): Promise<void> {
        await SecureStorage.set(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    },

    /**
     * Check if onboarding is completed
     */
    async isOnboardingCompleted(): Promise<boolean> {
        const completed = await SecureStorage.get(STORAGE_KEYS.ONBOARDING_COMPLETED);
        return completed === 'true';
    },

    /**
     * Mark welcome screen as seen
     */
    async setWelcomeSeen(): Promise<void> {
        await SecureStorage.set(STORAGE_KEYS.WELCOME_SEEN, 'true');
    },

    /**
     * Check if welcome screen has been seen
     */
    async isWelcomeSeen(): Promise<boolean> {
        const seen = await SecureStorage.get(STORAGE_KEYS.WELCOME_SEEN);
        return seen === 'true';
    },

    /**
     * Store remember me preference
     */
    async setRememberMe(remember: boolean): Promise<void> {
        await SecureStorage.set(STORAGE_KEYS.REMEMBER_ME, remember.toString());
    },

    /**
     * Get remember me preference
     */
    async getRememberMe(): Promise<boolean> {
        const remember = await SecureStorage.get(STORAGE_KEYS.REMEMBER_ME);
        return remember === 'true';
    },

    /**
     * Store saved email for remember me
     */
    async setSavedEmail(email: string): Promise<void> {
        await SecureStorage.set(STORAGE_KEYS.SAVED_EMAIL, email);
    },

    /**
     * Get saved email
     */
    async getSavedEmail(): Promise<string | null> {
        return await SecureStorage.get(STORAGE_KEYS.SAVED_EMAIL);
    },

    /**
     * Clear remember me data
     */
    async clearRememberMe(): Promise<void> {
        await SecureStorage.delete(STORAGE_KEYS.REMEMBER_ME);
        await SecureStorage.delete(STORAGE_KEYS.SAVED_EMAIL);
    },
}; 