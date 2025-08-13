// lib/queryKeys.ts
export const qk = {
    user: (id?: string) => ['user', id] as const,
    session: ['session'] as const,
    profiles: (id: string) => ['profiles', id] as const,
    clerkUser: (clerkId: string) => ['clerkUser', clerkId] as const,
    linksList: (owner: { userId?: string; clerkUserId?: string; filter?: string }) => ['links', owner] as const,
    linkById: (id: string) => ['link', id] as const,
    articlesList: (params?: Record<string, any>) => ['articles', params] as const,
    articleById: (id: string) => ['article', id] as const,
    topPicks: ['topPicks'] as const,
    subscriptions: (userId?: string) => ['subscriptions', userId] as const,
    audioByText: (text: string) => ['audio', text] as const,
};
