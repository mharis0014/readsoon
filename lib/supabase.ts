import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl: string | undefined = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey: string | undefined = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Helper function to get the current user
export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
};

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
};

// Helper function to create user profile if it doesn't exist
export const createUserProfile = async (userId: string, userData: { email?: string; username?: string }) => {
    const { data, error } = await supabase
        .from('profiles')
        .insert({
            id: userId,
            username: userData.username || userData.email?.split('@')[0] || 'user',
            email: userData.email,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Helper function to get or create user profile
export const getOrCreateUserProfile = async (userId: string, userData: { email?: string; username?: string }) => {
    try {
        // Try to get existing profile
        return await getUserProfile(userId);
    } catch (error: any) {
        // If profile doesn't exist (PGRST116 error), create it
        if (error.code === 'PGRST116') {
            return await createUserProfile(userId, userData);
        }
        throw error;
    }
};

// Helper function to update user profile
export const updateUserProfile = async (userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}; 