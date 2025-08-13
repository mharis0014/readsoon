import React, { createContext, useContext, useEffect, useState } from 'react';

import { HybridUser } from '@/types/user';
import { supabase } from '../lib/supabase';

interface HybridUserContextType {
    user: HybridUser | null;
    isLoading: boolean;
    logout: () => Promise<void>;
}

const HybridUserContext = createContext<HybridUserContextType | undefined>(undefined);

export const HybridUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<HybridUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial auth check on app start
    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);

            try {
                // Check Supabase session
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        provider: 'supabase',
                        email: session.user.email || '',
                        username: session.user.user_metadata?.username || null,
                        fullName: session.user.user_metadata?.full_name || null,
                        avatarUrl: session.user.user_metadata?.avatar_url || null,
                        createdAt: session.user.created_at,
                    });
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Listen for Supabase auth changes
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    setUser({
                        id: session.user.id,
                        provider: 'supabase',
                        email: session.user.email || '',
                        username: session.user.user_metadata?.username || null,
                        fullName: session.user.user_metadata?.full_name || null,
                        avatarUrl: session.user.user_metadata?.avatar_url || null,
                        createdAt: session.user.created_at,
                    });
                } else if (event === 'SIGNED_OUT') {
                    // Only clear user if it was a Supabase user
                    setUser(prevUser => prevUser?.provider === 'supabase' ? null : prevUser);
                } else if (event === 'TOKEN_REFRESHED' && session?.user) {
                    // Update user data on token refresh
                    setUser({
                        id: session.user.id,
                        provider: 'supabase',
                        email: session.user.email || '',
                        username: session.user.user_metadata?.username || null,
                        fullName: session.user.user_metadata?.full_name || null,
                        avatarUrl: session.user.user_metadata?.avatar_url || null,
                        createdAt: session.user.created_at,
                    });
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        try {
            // Sign out from Supabase
            await supabase.auth.signOut();
            setUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
            // Still clear user even if logout fails
            setUser(null);
        }
    };

    return (
        <HybridUserContext.Provider value={{ user, isLoading, logout }}>
            {children}
        </HybridUserContext.Provider>
    );
};

export const useHybridUser = () => {
    const context = useContext(HybridUserContext);
    if (context === undefined) {
        throw new Error('useHybridUser must be used within a HybridUserProvider');
    }
    return context;
};
