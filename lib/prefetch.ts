import { ArticleService } from '../services/articleService';
import { queryClient } from './queryClient';
import { qk } from './queryKeys';

export async function prefetchArticleById(id: string) {
    await queryClient.prefetchQuery({
        queryKey: qk.articleById(id),
        queryFn: () => ArticleService.getArticle(id),
        staleTime: 1000 * 60 * 5,
    });
}

export async function prefetchUserProfile(userId: string, email?: string) {
    await queryClient.prefetchQuery({
        queryKey: qk.profiles(userId),
        queryFn: async () => {
            // Import the helper function from useUserProfile
            const { data: existingProfile, error: fetchError } = await import('../lib/supabase').then(({ supabase }) =>
                supabase.from('profiles').select('*').eq('id', userId).single()
            );

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            if (existingProfile) {
                return existingProfile;
            }

            // Create new profile if doesn't exist
            const { data: newProfile, error: createError } = await import('../lib/supabase').then(({ supabase }) =>
                supabase.from('profiles').insert({
                    id: userId,
                    email: email,
                    username: email?.split('@')[0] || 'user',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }).select('*').single()
            );

            if (createError) {
                throw createError;
            }

            return newProfile;
        },
        staleTime: 1000 * 60 * 2,
    });
}
