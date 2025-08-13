import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { qk } from '../lib/queryKeys';
import { ArticleService } from '../services/articleService';

export function useArticlesList(params?: Record<string, any>) {
    return useQuery({
        queryKey: qk.articlesList(params),
        queryFn: () => ArticleService.getUserArticles(params?.userId || ''),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useArticleById(id: string) {
    return useQuery({
        queryKey: qk.articleById(id),
        queryFn: () => ArticleService.getArticle(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 10, // 10 minutes for article details
    });
}

export function useUpsertArticle() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, articleData }: { userId: string; articleData: any }) =>
            ArticleService.saveArticle(userId, articleData),
        onSuccess: (article) => {
            qc.setQueryData(qk.articleById(article.id), article);
            qc.invalidateQueries({ queryKey: qk.articlesList({}) });
        },
    });
}

export function useTopPicks() {
    return useQuery({
        queryKey: qk.topPicks,
        queryFn: () => ArticleService.getUserArticles(''), // This needs to be updated based on your needs
        staleTime: 1000 * 60 * 30, // 30 minutes for top picks
    });
}

export function useStaffPicks() {
    return useQuery({
        queryKey: ['staffPicks'],
        queryFn: () => ArticleService.getUserArticles(''), // This needs to be updated based on your needs
        staleTime: 1000 * 60 * 30, // 30 minutes for staff picks
    });
}
