import React, { createContext, useContext, useEffect } from 'react';

import { useSession } from '@/hooks/useSession';
import { useUserProfile } from '@/hooks/useUserProfile';
import { HybridUser } from '@/types/user';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface HybridUserContextType {
    user: HybridUser | null;
    isLoading: boolean;
    logout: () => Promise<void>;
}

const HybridUserContext = createContext<HybridUserContextType | undefined>(undefined);

export const HybridUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();
    const { data: session, isLoading: sessionLoading } = useSession();
    const { data: profile, isLoading: profileLoading } = useUserProfile(
        session?.user?.id,
        session?.user?.email
    );

    // Derive user from session and profile
    const user: HybridUser | null = session?.user ? {
        id: session.user.id,
        provider: 'supabase',
        email: session.user.email || '',
        username: profile?.username || session.user.user_metadata?.username || null,
        fullName: profile?.full_name || session.user.user_metadata?.full_name || null,
        avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url || null,
        createdAt: session.user.created_at,
    } : null;

    const isLoading = sessionLoading || profileLoading;

    // Listen for Supabase auth changes and invalidate queries
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    // Invalidate session and profile queries to refetch
                    queryClient.invalidateQueries({ queryKey: ['session'] });
                    if (session?.user?.id) {
                        queryClient.invalidateQueries({ queryKey: ['profiles', session.user.id] });
                    }
                } else if (event === 'SIGNED_OUT') {
                    // Clear all queries on sign out
                    queryClient.clear();
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [queryClient]);

    const logout = async () => {
        try {
            // Sign out from Supabase
            await supabase.auth.signOut();
            // Clear all queries on logout
            queryClient.clear();
        } catch (error) {
            console.error('Error during logout:', error);
            // Still clear queries even if logout fails
            queryClient.clear();
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
