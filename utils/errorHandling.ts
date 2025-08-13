import { Alert } from 'react-native';

export interface NetworkError {
    message: string;
    code?: string;
    status?: number;
    isNetworkError: boolean;
    isTimeout: boolean;
    isServerError: boolean;
    isClientError: boolean;
}

export interface ErrorConfig {
    title?: string;
    message?: string;
    showAlert?: boolean;
    onRetry?: () => void;
    retryText?: string;
    cancelText?: string;
}

/**
 * Detect if an error is a network-related error
 */
export function isNetworkError(error: any): boolean {
    if (!error) return false;

    // Check for common network error patterns
    const networkErrorPatterns = [
        'Network request failed',
        'Network Error',
        'fetch failed',
        'timeout',
        'ECONNREFUSED',
        'ENOTFOUND',
        'ECONNRESET',
        'ERR_NETWORK',
        'ERR_INTERNET_DISCONNECTED',
        'ERR_CONNECTION_REFUSED',
        'ERR_CONNECTION_TIMED_OUT',
    ];

    const errorMessage = error.message || error.toString() || '';
    const errorCode = error.code || '';

    return networkErrorPatterns.some(pattern =>
        errorMessage.toLowerCase().includes(pattern.toLowerCase()) ||
        errorCode.toLowerCase().includes(pattern.toLowerCase())
    );
}

/**
 * Detect if an error is a timeout error
 */
export function isTimeoutError(error: any): boolean {
    if (!error) return false;

    const timeoutPatterns = [
        'timeout',
        'timed out',
        'ETIMEDOUT',
        'ERR_CONNECTION_TIMED_OUT',
    ];

    const errorMessage = error.message || error.toString() || '';
    const errorCode = error.code || '';

    return timeoutPatterns.some(pattern =>
        errorMessage.toLowerCase().includes(pattern.toLowerCase()) ||
        errorCode.toLowerCase().includes(pattern.toLowerCase())
    );
}

/**
 * Detect if an error is a server error (5xx)
 */
export function isServerError(error: any): boolean {
    if (!error) return false;

    const status = error.status || error.statusCode || error.response?.status;
    return status >= 500 && status < 600;
}

/**
 * Detect if an error is a client error (4xx)
 */
export function isClientError(error: any): boolean {
    if (!error) return false;

    const status = error.status || error.statusCode || error.response?.status;
    return status >= 400 && status < 500;
}

/**
 * Parse error into a standardized format
 */
export function parseError(error: any): NetworkError {
    const isNetwork = isNetworkError(error);
    const isTimeout = isTimeoutError(error);
    const isServer = isServerError(error);
    const isClient = isClientError(error);

    return {
        message: error.message || error.toString() || 'An unknown error occurred',
        code: error.code || error.status || error.statusCode,
        status: error.status || error.statusCode || error.response?.status,
        isNetworkError: isNetwork,
        isTimeout,
        isServerError: isServer,
        isClientError: isClient,
    };
}

/**
 * Get user-friendly error message based on error type
 */
export function getErrorMessage(error: NetworkError, context?: string): string {

    if (context === 'auth') {
        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes('invalid login credentials') ||
            errorMessage.includes('invalid email or password')) {
            return 'Invalid email or password. If you signed up with Google, Facebook, or Apple, please use that option instead.';
        }

        if (errorMessage.includes('email not confirmed')) {
            return 'Please check your email and confirm your account before logging in.';
        }

        if (errorMessage.includes('too many requests')) {
            return 'Too many login attempts. Please wait a moment and try again.';
        }

        if (errorMessage.includes('user not found')) {
            return 'Account not found. Please check your email or sign up.';
        }

        if (errorMessage.includes('email already registered') ||
            errorMessage.includes('user already registered') ||
            errorMessage.includes('User already registered') ||
            errorMessage.includes('already been registered') ||
            errorMessage.includes('already exists')) {
            return 'This email is already registered. You can set a password for your account to enable email/password login.';
        }

        if (errorMessage.includes('password should be at least')) {
            return 'Password is too short. Please choose a password with at least 6 characters.';
        }

        if (errorMessage.includes('invalid email')) {
            return 'Please enter a valid email address.';
        }

        if (errorMessage.includes('weak password')) {
            return 'Password is too weak. Please choose a stronger password.';
        }

        if (errorMessage.includes('invalid email')) {
            return 'Please enter a valid email address.';
        }

        // For other auth errors, show the actual error message
        return error.message || 'Authentication failed. Please try again.';
    }

    if (error.isTimeout) {
        return 'Request timed out. Please check your connection and try again.';
    }

    if (error.isNetworkError) {
        return 'No internet connection. Please check your network and try again.';
    }

    if (error.isServerError) {
        return 'Server error. Please try again later.';
    }

    if (error.isClientError) {
        switch (error.status) {
            case 401:
                return 'Authentication failed. Please log in again.';
            case 403:
                return 'Access denied. You don\'t have permission to perform this action.';
            case 404:
                return context === 'article'
                    ? 'Article not found. The URL may be invalid or the article has been removed.'
                    : 'Resource not found.';
            case 429:
                return 'Too many requests. Please wait a moment and try again.';
            default:
                return 'Request failed. Please try again.';
        }
    }

    return error.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Get error title based on error type
 */
export function getErrorTitle(error: NetworkError): string {
    if (error.isTimeout) return 'Connection Timeout';
    if (error.isNetworkError) return 'No Internet Connection';
    if (error.isServerError) return 'Server Error';
    if (error.isClientError) return 'Request Failed';
    return 'Error';
}

/**
 * Show error alert with retry option
 */
export function showErrorAlert(
    error: any,
    config: ErrorConfig = {}
): Promise<boolean> {
    return new Promise((resolve) => {
        const parsedError = parseError(error);
        const title = config.title || getErrorTitle(parsedError);
        const message = config.message || getErrorMessage(parsedError, config.title?.toLowerCase());
        const retryText = config.retryText || 'Retry';
        const cancelText = config.cancelText || 'OK';

        if (config.onRetry) {
            Alert.alert(
                title,
                message,
                [
                    { text: cancelText, onPress: () => resolve(false) },
                    { text: retryText, onPress: () => resolve(true) }
                ]
            );
        } else {
            Alert.alert(title, message, [{ text: cancelText, onPress: () => resolve(false) }]);
        }
    });
}

/**
 * Handle async operation with error handling
 */
export async function handleAsyncOperation<T>(
    operation: () => Promise<T>,
    errorConfig: ErrorConfig = {}
): Promise<T | null> {
    try {
        return await operation();
    } catch (error) {
        console.error('Operation failed:', error);

        if (errorConfig.showAlert !== false) {
            const shouldRetry = await showErrorAlert(error, errorConfig);
            if (shouldRetry && errorConfig.onRetry) {
                return handleAsyncOperation(operation, errorConfig);
            }
        }

        return null;
    }
}

/**
 * Create a retry wrapper for async operations
 */
export function withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): () => Promise<T> {
    return async () => {
        let lastError: any;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;

                if (attempt === maxRetries) {
                    throw error;
                }

                // Only retry on network errors or server errors
                const parsedError = parseError(error);
                if (!parsedError.isNetworkError && !parsedError.isServerError) {
                    throw error;
                }

                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }

        throw lastError;
    };
}

/**
 * Common error messages for different contexts
 */
export const ERROR_MESSAGES = {
    NETWORK: {
        NO_CONNECTION: 'No internet connection. Please check your network and try again.',
        TIMEOUT: 'Request timed out. Please check your connection and try again.',
        SERVER_ERROR: 'Server error. Please try again later.',
        UNKNOWN: 'Network error. Please try again.',
    },
    AUTH: {
        INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
        ACCOUNT_NOT_FOUND: 'Account not found. Please check your email or sign up.',
        EMAIL_IN_USE: 'This email is already registered. Please try logging in.',
        WEAK_PASSWORD: 'Password is too weak. Please choose a stronger password.',
        INVALID_EMAIL: 'Please enter a valid email address.',
    },
    ARTICLE: {
        INVALID_URL: 'Please enter a valid URL.',
        FETCH_FAILED: 'Failed to fetch article. Please check the URL and try again.',
        NOT_FOUND: 'Article not found. The URL may be invalid or the article has been removed.',
        PARSE_FAILED: 'Failed to parse article content. Please try a different URL.',
    },
    TTS: {
        NO_CONTENT: 'No content available to read.',
        VOICE_NOT_AVAILABLE: 'Voice not available on this device.',
        PLAYBACK_FAILED: 'Failed to start playback. Please try again.',
    },
    STORAGE: {
        SAVE_FAILED: 'Failed to save data. Please try again.',
        LOAD_FAILED: 'Failed to load data. Please restart the app.',
        CLEAR_FAILED: 'Failed to clear data. Please try again.',
    },
} as const; 