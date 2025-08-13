export interface ProfileData {
    username: string;
    email: string;
    avatar: any;
    stats: {
        articlesRead: number;
        timeSaved: number;
        streak: number;
    };
    preferences: {
        theme: 'light' | 'dark' | 'auto';
        notifications: boolean;
        autoSave: boolean;
    };
}

export const mockProfile: ProfileData = {
    username: 'john_doe',
    email: 'john.doe@example.com',
    avatar: require('../assets/images/user.jpg'),
    stats: {
        articlesRead: 127,
        timeSaved: 45,
        streak: 12
    },
    preferences: {
        theme: 'auto',
        notifications: true,
        autoSave: true
    }
};

export const getAccountItems = () => [
    { id: 'profile', title: 'Profile', icon: '👤' },
    { id: 'security', title: 'Security', icon: '🔒' },
    { id: 'privacy', title: 'Privacy', icon: '🛡️' },
];

export const getSettingsItems = () => [
    { id: 'notifications', title: 'Notifications', icon: '🔔' },
    { id: 'theme', title: 'Theme', icon: '🎨' },
    { id: 'language', title: 'Language', icon: '🌐' },
    { id: 'storage', title: 'Storage', icon: '💾' },
];

export const getUserStats = () => [
    { number: '127', label: 'Articles Read' },
    { number: '45h', label: 'Time Saved' },
    { number: '12 days', label: 'Reading Streak' },
]; 