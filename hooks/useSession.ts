import { useQuery } from '@tanstack/react-query';
import { qk } from '../lib/queryKeys';
import { supabase } from '../lib/supabase';

export function useSession() {
    return useQuery({
        queryKey: qk.session,
        queryFn: async () => {
            const { data } = await supabase.auth.getSession();
            return data.session ?? null;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}
