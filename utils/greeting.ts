export const getGreeting = (): string => {
    // Get current time in user's local timezone
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
        return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
        return 'Good Afternoon';
    } else if (hour >= 17 && hour < 20) {
        return 'Good Evening';
    } else {
        return 'Good Night';
    }
};

/**
 * Extract the first name from user's full name or username
 */
export const getFirstName = (user: { fullName?: string | null; username?: string | null } | null): string => {
    if (!user) return 'Guest';

    // Try to get first name from fullName
    if (user.fullName) {
        const firstName = user.fullName.split(' ')[0];
        if (firstName) return firstName;
    }

    // Fall back to username
    if (user.username) {
        return user.username;
    }

    // Final fallback
    return 'Guest';
}; 