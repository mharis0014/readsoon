import { Session } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { getOrCreateUserProfile, supabase, updateUserProfile } from '../lib/supabase';
import { User } from '../types/user';
import { getErrorMessage, parseError } from '../utils/errorHandling';
import { StorageHelpers } from '../utils/secureStorage';

export type UpdateProfilePayload = Partial<Pick<User, 'username' | 'avatar'>>;

type UserContextType = {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    signup: (email: string, username: string, password: string) => Promise<void>;
    updateProfile: (data: UpdateProfilePayload) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true); // start loading until auth is resolved
    const [error, setError] = useState<string | null>(null);

    const loadUserProfile = useCallback(async (userId: string, userEmail?: string) => {
        try {
            const profile = await getOrCreateUserProfile(userId, {
                email: userEmail,
                username: userEmail?.split('@')[0],
            });

            const userData: User = {
                id: profile.id,
                email: userEmail || '',
                username: profile.username || '',
                avatar: profile.avatar_url || require('@/assets/images/user.jpg'),
                createdAt: profile.updated_at || new Date().toISOString(),
            };
            setUser(userData);
            await StorageHelpers.setUserData(userData);
        } catch (error) {
            console.error('Error loading user profile:', error);
            // Just use basic user data from Supabase
            const userData: User = {
                id: userId,
                email: userEmail || '',
                username: userEmail?.split('@')[0] || '',
                avatar: require('@/assets/images/user.jpg'),
                createdAt: new Date().toISOString(),
            };
            setUser(userData);
        }
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Load stored user data for immediate UI
                const storedUser = await StorageHelpers.getUserData();
                if (storedUser) {
                    setUser(storedUser);
                }

                // Check current Supabase session
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);

                if (session?.user) {
                    await loadUserProfile(session.user.id, session.user.email);
                } else if (!storedUser) {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                try {
                    setSession(session);
                    if (session?.user) {
                        await loadUserProfile(session.user.id, session.user.email);
                    } else {
                        setUser(null);
                        await StorageHelpers.clearUserData();
                    }
                } catch (error) {
                    console.error('Error in auth state change:', error);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [loadUserProfile]);

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                setSession(data.session);
                await loadUserProfile(data.user.id, data.user.email);
            }
        } catch (e: any) {
            const parsedError = parseError(e);
            const errorMessage = getErrorMessage(parsedError, 'auth');
            setError(errorMessage);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, [loadUserProfile]);

    const loginWithGoogle = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'readsoon://auth/callback',
                },
            });

            if (error) throw error;
        } catch (e: any) {
            const parsedError = parseError(e);
            const errorMessage = getErrorMessage(parsedError, 'auth');
            setError(errorMessage);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signup = useCallback(async (email: string, username: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                setSession(data.session);
                await loadUserProfile(data.user.id, data.user.email);
            }
        } catch (e: any) {
            const parsedError = parseError(e);
            const errorMessage = getErrorMessage(parsedError, 'auth');
            setError(errorMessage);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, [loadUserProfile]);

    const updateProfile = useCallback(async (data: UpdateProfilePayload) => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            const updatedProfile = await updateUserProfile(user.id, {
                username: data.username,
                avatar_url: data.avatar,
            });

            const updatedUser: User = {
                ...user,
                username: updatedProfile.username || user.username,
                avatar: updatedProfile.avatar_url || user.avatar,
            };

            setUser(updatedUser);
            await StorageHelpers.setUserData(updatedUser);
        } catch (e: any) {
            const parsedError = parseError(e);
            const errorMessage = getErrorMessage(parsedError, 'storage');
            setError(errorMessage);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setUser(null);
            setSession(null);
            await StorageHelpers.clearUserData();
        } catch (e: any) {
            const parsedError = parseError(e);
            const errorMessage = getErrorMessage(parsedError, 'storage');
            setError(errorMessage);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                session,
                isLoading,
                error,
                login,
                loginWithGoogle,
                signup,
                updateProfile,
                logout,
                clearError,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
