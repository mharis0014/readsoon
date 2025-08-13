import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { qk } from '../lib/queryKeys';
import { supabase } from '../lib/supabase';

// Helper function to get or create user profile
async function getOrCreateUserProfile(userId: string, userData: { email?: string; username?: string }) {
    // First try to get existing profile
    const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
    }

    if (existingProfile) {
        return existingProfile;
    }

    // Create new profile if doesn't exist
    const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
            id: userId,
            email: userData.email,
            username: userData.username || userData.email?.split('@')[0] || 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select('*')
        .single();

    if (createError) {
        throw createError;
    }

    return newProfile;
}

// Helper function to update user profile
async function updateUserProfile(userId: string, data: { username?: string; avatar_url?: string }) {
    const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select('*')
        .single();

    if (error) {
        throw error;
    }

    return updatedProfile;
}

export function useUserProfile(userId?: string, email?: string) {
    return useQuery({
        queryKey: userId ? qk.profiles(userId) : ['profiles', 'anonymous'],
        enabled: !!userId,
        queryFn: async () => {
            if (!userId) return null;
            return getOrCreateUserProfile(userId, { email, username: email?.split('@')[0] });
        },
    });
}

export function useUpdateUserProfile() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: { username?: string; avatar_url?: string } }) =>
            updateUserProfile(userId, data),
        onSuccess: (res, { userId }) => {
            qc.invalidateQueries({ queryKey: qk.profiles(userId) });
        },
    });
}
