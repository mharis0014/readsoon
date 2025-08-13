import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../lib/supabase';

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

export const signInWithGoogle = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://hibolwdseedujzyvsqiv.supabase.co/auth/v1/callback',
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                skipBrowserRedirect: true,
            },
        });

        if (error) {
            throw error;
        }

        // Open the OAuth URL in a web browser
        if (data?.url) {
            const result = await WebBrowser.openAuthSessionAsync(
                data.url,
                'https://hibolwdseedujzyvsqiv.supabase.co/auth/v1/callback'
            );

            if (result.type === 'success') {
                // Get the URL from the success result
                const { url } = result;

                // Exchange the code for a session
                if (url) {
                    // Extract code from URL
                    const parsedUrl = new URL(url);
                    const code = parsedUrl.searchParams.get('code');

                    if (code) {
                        const { data: sessionData, error: sessionError } =
                            await supabase.auth.exchangeCodeForSession(code);

                        if (sessionError) {
                            throw sessionError;
                        }

                        return { data: sessionData, error: null };
                    }
                }

                return { data: result, error: null };
            } else if (result.type === 'cancel') {
                return { data: null, error: new Error('OAuth cancelled by user') };
            } else {
                return { data: null, error: new Error('OAuth failed') };
            }
        }

        return { data, error: null };

    } catch (error) {
        return { data: null, error };
    }
};

export const signInWithFacebook = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
                redirectTo: 'https://hibolwdseedujzyvsqiv.supabase.co/auth/v1/callback',
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                skipBrowserRedirect: true,
            },
        });

        if (error) {
            throw error;
        }

        // Open the OAuth URL in a web browser
        if (data?.url) {
            const result = await WebBrowser.openAuthSessionAsync(
                data.url,
                'https://hibolwdseedujzyvsqiv.supabase.co/auth/v1/callback'
            );

            if (result.type === 'success') {
                // Get the URL from the success result
                const { url } = result;

                // Exchange the code for a session
                if (url) {
                    // Extract code from URL
                    const parsedUrl = new URL(url);
                    const code = parsedUrl.searchParams.get('code');

                    if (code) {
                        const { data: sessionData, error: sessionError } =
                            await supabase.auth.exchangeCodeForSession(code);

                        if (sessionError) {
                            throw sessionError;
                        }

                        return { data: sessionData, error: null };
                    }
                }

                return { data: result, error: null };
            } else if (result.type === 'cancel') {
                return { data: null, error: new Error('Facebook OAuth cancelled by user') };
            } else {
                return { data: null, error: new Error('Facebook OAuth failed') };
            }
        }

        return { data, error: null };

    } catch (error) {
        return { data: null, error };
    }
};

export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { error: null };
    } catch (error) {
        return { data: null, error };
    }
}; 