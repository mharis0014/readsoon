/**
 * User type definition for ReadSoon app
 */
export type User = {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    createdAt: string;
};

/**
 * User type for Supabase users
 */
export type HybridUser = {
    id: string;
    provider: 'supabase';
    email: string;
    username: string | null;
    fullName?: string | null;
    avatarUrl?: string | null;
    createdAt: string;
}; 