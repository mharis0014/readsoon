import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';

import { StorageHelpers } from '@/utils/secureStorage';
import { supabase } from '../lib/supabase';

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

export const useHybridAuth = () => {
    const [isLoading, setIsLoading] = useState(false);

    const loginWithEmail = async (email: string, password: string, rememberMe: boolean = false) => {
        setIsLoading(true);
        try {
            // Login with Supabase
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            try {
                if (rememberMe) {
                    await StorageHelpers.setRememberMe(true);
                    await StorageHelpers.setSavedEmail(email);
                } else {
                    await StorageHelpers.clearRememberMe();
                }
            } catch (rememberError) {
                console.warn('Failed to save remember me preference:', rememberError);
                // Don't throw - login should still succeed
            }

            return { success: true, provider: 'supabase' };
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signupWithEmail = async (email: string, password: string, username: string) => {
        setIsLoading(true);
        try {
            console.log('Starting signup for:', email);
            console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
            console.log('Supabase Key exists:', !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

            // FIRST: Check if user is already logged in with this email
            const { data: currentUser } = await supabase.auth.getUser();
            console.log('Current user check:', {
                hasUser: !!currentUser.user,
                userEmail: currentUser.user?.email,
                signupEmail: email,
                provider: currentUser.user?.app_metadata?.provider
            });

            if (currentUser.user && currentUser.user.email === email) {
                // User is logged in with this email - check if it's an OAuth user
                const isOAuthUser = currentUser.user.app_metadata?.provider === 'google' ||
                    currentUser.user.app_metadata?.provider === 'facebook' ||
                    currentUser.user.app_metadata?.provider === 'apple';

                console.log('User is logged in with same email, isOAuthUser:', isOAuthUser);

                if (isOAuthUser) {
                    // OAuth user - throw special error for Set Password screen
                    console.log('Throwing User already registered error');
                    throw new Error('User already registered');
                } else {
                    // Regular email user - throw error for email verification
                    console.log('Throwing Email already registered error');
                    throw new Error('Email already registered');
                }
            }



            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                    },
                    emailRedirectTo: 'readsoon://auth/email-confirmation',
                },
            });

            console.log('Supabase signup response:', { data, error });

            // Check if signup succeeded but user already exists (no session, email confirmation sent)
            if (!error && data.user && !data.session) {
                console.log('User created but no session - checking if this is an existing OAuth user');

                // Try to sign in with Google to see if this email exists as OAuth user
                try {
                    const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: 'readsoon://auth/callback',
                            skipBrowserRedirect: true,
                        },
                    });

                    if (oauthData?.url && !oauthError) {
                        // OAuth is available - this might be an OAuth user
                        console.log('OAuth available - likely an OAuth user');
                        throw new Error('User already registered');
                    }
                } catch (oauthCheckError) {
                    console.log('OAuth check failed:', oauthCheckError);
                    // Re-throw the error if it's our "User already registered" error
                    if (oauthCheckError instanceof Error && oauthCheckError.message === 'User already registered') {
                        throw oauthCheckError;
                    }
                }
            }

            if (error) {
                console.error('Detailed Supabase error:', {
                    message: error.message,
                    status: error.status,
                    name: error.name
                });
                console.error('Supabase signup error:', error);

                if (error.message?.includes('already registered') ||
                    error.message?.includes('already exists')) {
                    // Check if this might be an OAuth user by checking the error details
                    console.log('Signup failed with already registered error');
                    console.log('Error details:', error);

                    // If the error mentions OAuth or provider, it's likely an OAuth user
                    if (error.message?.toLowerCase().includes('oauth') ||
                        error.message?.toLowerCase().includes('provider') ||
                        error.message?.toLowerCase().includes('google') ||
                        error.message?.toLowerCase().includes('facebook') ||
                        error.message?.toLowerCase().includes('apple')) {
                        throw new Error('User already registered');
                    } else {
                        throw new Error('Email already registered');
                    }
                }

                throw new Error(error.message || 'Signup failed. Please try again.');
            } else {
                // Check if email confirmation is required
                if (data.user && !data.session) {
                    // Email confirmation required - show message to user
                    return {
                        success: true,
                        provider: 'supabase',
                        requiresConfirmation: true,
                        message: 'Please check your email to confirm your account before signing in.'
                    };
                }

                // Check if user is automatically signed in
                if (data.session && data.user) {
                    // User is automatically signed in - save session and user data
                    try {
                        // Ensure profile is created/updated with username
                        const { error: profileError } = await supabase
                            .from('profiles')
                            .upsert({
                                id: data.user.id,
                                username: username,
                            }, { onConflict: 'id' });

                        if (profileError) {
                            console.warn('Failed to create/update profile:', profileError);
                        }

                        // Save user data to secure storage
                        await StorageHelpers.setUserData({
                            id: data.user.id,
                            email: data.user.email || '',
                            username: username,
                            provider: 'supabase',
                            createdAt: data.user.created_at,
                        });

                        return { success: true, provider: 'supabase', session: data.session };
                    } catch (storageError) {
                        console.warn('Failed to save user data:', storageError);
                        // Still return success even if storage fails
                        return { success: true, provider: 'supabase', session: data.session };
                    }
                } else if (data.user) {
                    // User created but no session - try to sign them in immediately
                    try {
                        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                            email,
                            password,
                        });

                        if (signInError) throw signInError;

                        if (signInData.session) {
                            // Ensure profile is created/updated with username
                            const { error: profileError } = await supabase
                                .from('profiles')
                                .upsert({
                                    id: signInData.user.id,
                                    username: username,
                                }, { onConflict: 'id' });

                            if (profileError) {
                                console.warn('Failed to create/update profile:', profileError);
                            }

                            // Save user data to secure storage
                            await StorageHelpers.setUserData({
                                id: signInData.user.id,
                                email: signInData.user.email || '',
                                username: username,
                                provider: 'supabase',
                                createdAt: signInData.user.created_at,
                            });

                            return { success: true, provider: 'supabase', session: signInData.session };
                        }
                    } catch (autoSignInError) {
                        console.warn('Auto sign-in failed:', autoSignInError);
                        // Email confirmation required
                        return {
                            success: true,
                            provider: 'supabase',
                            requiresConfirmation: true,
                            message: 'Account created successfully. Please check your email to confirm your account.'
                        };
                    }
                }

                // Fallback - email confirmation required
                return {
                    success: true,
                    provider: 'supabase',
                    requiresConfirmation: true,
                    message: 'Account created successfully. Please check your email to confirm your account.'
                };
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        setIsLoading(true);
        try {
            // Use Supabase OAuth with explicit WebBrowser handling
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'readsoon://auth/callback',
                    skipBrowserRedirect: true,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) {
                throw error;
            }

            if (data?.url) {
                // Open OAuth URL in WebBrowser with custom scheme redirect
                const result = await WebBrowser.openAuthSessionAsync(
                    data.url,
                    'readsoon://auth/callback'
                );

                if (result.type === 'success' && result.url) {
                    // Try to extract tokens from both URL params and fragments
                    const url = new URL(result.url);

                    // Check URL search params first
                    const searchParams = url.searchParams;
                    let access_token = searchParams.get('access_token');
                    let refresh_token = searchParams.get('refresh_token');

                    // If not in search params, check hash fragments
                    if (!access_token && url.hash) {
                        const fragment = url.hash.substring(1); // Remove the # 
                        const fragmentParams = new URLSearchParams(fragment);
                        access_token = fragmentParams.get('access_token');
                        refresh_token = fragmentParams.get('refresh_token');
                    }

                    if (access_token) {
                        // Set the session in Supabase with the tokens
                        const { error: sessionError } = await supabase.auth.setSession({
                            access_token,
                            refresh_token: refresh_token || '',
                        });

                        if (sessionError) {
                            throw sessionError;
                        }

                        return { success: true, provider: 'supabase' };
                    } else {
                        // Still try to redirect to onboarding in case the session was created another way
                        return { success: true, provider: 'supabase' };
                    }
                } else if (result.type === 'cancel') {
                    throw new Error('OAuth cancelled by user');
                } else {
                    throw new Error('OAuth failed or was dismissed');
                }
            } else {
                throw new Error('No OAuth URL generated');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithFacebook = async () => {
        setIsLoading(true);
        try {
            // Use the same working OAuth approach as Google
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'facebook',
                options: {
                    redirectTo: 'readsoon://auth/callback',
                    skipBrowserRedirect: true,
                },
            });

            if (error) {
                throw error;
            }

            if (data?.url) {
                // Open OAuth URL in WebBrowser with custom scheme redirect
                const result = await WebBrowser.openAuthSessionAsync(
                    data.url,
                    'readsoon://auth/callback'
                );

                if (result.type === 'success' && result.url) {
                    // Try to extract tokens from both URL params and fragments
                    const url = new URL(result.url);

                    // Check URL search params first
                    const searchParams = url.searchParams;
                    let access_token = searchParams.get('access_token');
                    let refresh_token = searchParams.get('refresh_token');

                    // If not in search params, check hash fragments
                    if (!access_token && url.hash) {
                        const fragment = url.hash.substring(1); // Remove the # 
                        const fragmentParams = new URLSearchParams(fragment);
                        access_token = fragmentParams.get('access_token');
                        refresh_token = fragmentParams.get('refresh_token');
                    }

                    if (access_token) {
                        // Set the session in Supabase with the tokens
                        const { error: sessionError } = await supabase.auth.setSession({
                            access_token,
                            refresh_token: refresh_token || '',
                        });

                        if (sessionError) {
                            throw sessionError;
                        }

                        return { success: true, provider: 'supabase' };
                    } else {
                        // Still try to redirect to onboarding in case the session was created another way
                        return { success: true, provider: 'supabase' };
                    }
                } else if (result.type === 'cancel') {
                    throw new Error('Facebook OAuth cancelled by user');
                } else {
                    throw new Error('Facebook OAuth failed or was dismissed');
                }
            } else {
                throw new Error('No Facebook OAuth URL generated');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const addPasswordToGoogleAccount = async (email: string, password: string, username: string) => {
        setIsLoading(true);
        try {
            // First, sign in with Google to get the user session
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'readsoon://auth/callback',
                    skipBrowserRedirect: true,
                },
            });

            if (error) {
                throw new Error('Please sign in with Google first to add a password to your account.');
            }

            if (data?.url) {
                const result = await WebBrowser.openAuthSessionAsync(
                    data.url,
                    'readsoon://auth/callback'
                );

                if (result.type === 'success' && result.url) {
                    const url = new URL(result.url);
                    const searchParams = url.searchParams;
                    let access_token = searchParams.get('access_token');
                    let refresh_token = searchParams.get('refresh_token');

                    if (!access_token && url.hash) {
                        const fragment = url.hash.substring(1);
                        const fragmentParams = new URLSearchParams(fragment);
                        access_token = fragmentParams.get('access_token');
                        refresh_token = fragmentParams.get('refresh_token');
                    }

                    if (access_token) {
                        // Set the session
                        const { error: sessionError } = await supabase.auth.setSession({
                            access_token,
                            refresh_token: refresh_token || '',
                        });

                        if (sessionError) {
                            throw sessionError;
                        }

                        // Now update the user with a password
                        const { error: updateError } = await supabase.auth.updateUser({
                            password: password,
                            data: {
                                username: username,
                            }
                        });

                        if (updateError) {
                            throw updateError;
                        }

                        // Update profile with username
                        const { data: userData } = await supabase.auth.getUser();
                        if (userData.user?.id) {
                            const { error: profileError } = await supabase
                                .from('profiles')
                                .upsert({
                                    id: userData.user.id,
                                    username: username,
                                }, { onConflict: 'id' });

                            if (profileError) {
                                console.warn('Failed to update profile:', profileError);
                            }
                        }

                        return {
                            success: true,
                            provider: 'supabase',
                            message: 'Password added successfully! You can now sign in with either Google or email/password.'
                        };
                    } else {
                        throw new Error('Failed to authenticate with Google. Please try again.');
                    }
                } else {
                    throw new Error('Google authentication was cancelled.');
                }
            } else {
                throw new Error('Failed to start Google authentication.');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        loginWithEmail,
        signupWithEmail,
        signInWithGoogle,
        signInWithFacebook,
        isLoading,
    };
};
