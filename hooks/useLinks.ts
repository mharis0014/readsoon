import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { qk } from '../lib/queryKeys';
import { supabase } from '../lib/supabase';

export function useLinks(owner: { userId?: string; filter?: string }) {
    return useQuery({
        queryKey: qk.linksList(owner),
        queryFn: async () => {
            let q = supabase.from('links').select('*').order('created_at', { ascending: false });
            if (owner.userId) q = q.eq('user_id', owner.userId);
            if (owner.filter) q = q.ilike('title', `%${owner.filter}%`);
            const { data, error } = await q;
            if (error) throw error;
            return data;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

export function useLinkById(id: string) {
    return useQuery({
        queryKey: qk.linkById(id),
        queryFn: async () => {
            const { data, error } = await supabase.from('links').select('*').eq('id', id).single();
            if (error) throw error;
            return data;
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useToggleFavorite() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, favorite }: { id: string; favorite: boolean }) => {
            const { data, error } = await supabase.from('links').update({ favorite }).eq('id', id).select('*').single();
            if (error) throw error;
            return data;
        },
        onSuccess: (updated) => {
            // Update list + detail in cache
            qc.setQueriesData({ queryKey: ['links'] }, (old: any) =>
                Array.isArray(old) ? old.map((x) => (x.id === updated.id ? updated : x)) : old
            );
            qc.setQueryData(qk.linkById(updated.id), updated);
        },
    });
}

export function useAddLink() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (linkData: { url: string; title?: string; user_id: string }) => {
            const { data, error } = await supabase.from('links').insert(linkData).select('*').single();
            if (error) throw error;
            return data;
        },
        onSuccess: (newLink) => {
            // Invalidate links list to refetch
            qc.invalidateQueries({ queryKey: ['links'] });
        },
    });
}

export function useDeleteLink() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('links').delete().eq('id', id);
            if (error) throw error;
            return id;
        },
        onSuccess: (deletedId) => {
            // Remove from cache and invalidate lists
            qc.removeQueries({ queryKey: qk.linkById(deletedId) });
            qc.invalidateQueries({ queryKey: ['links'] });
        },
    });
}
