import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { SCREEN_HEIGHT, spacing, TAB_BAR_HEIGHT, typography } from '../utils/responsive';

export const profileStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingBottom: TAB_BAR_HEIGHT,
    },

    header: {
        backgroundColor: Colors.red,
        paddingHorizontal: spacing.md,
        paddingTop: SCREEN_HEIGHT * 0.08,
        paddingBottom: spacing.lg,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },

    headerTitle: {
        color: Colors.white,
        fontSize: typography.xxl,
        fontWeight: 'bold',
    },

    headerSubtitle: {
        color: Colors.white,
        fontSize: typography.md,
        marginTop: spacing.xs,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingTop: spacing.lg,
        paddingBottom: 100, // Space for bottom navigation
    },

    section: {
        marginBottom: spacing.lg,
    },

    sectionHeader: {
        backgroundColor: '#FFF5F5', // Light pink background
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
    },

    sectionTitle: {
        fontSize: typography.md,
        fontWeight: '600',
        color: Colors.red,
    },

    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        backgroundColor: Colors.white,
    },

    settingItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },

    settingIcon: {
        width: typography.md,
        height: typography.md,
    },

    settingText: {
        fontSize: typography.md,
        color: '#2D2B2E',
        fontWeight: '400',
    },

    divider: {
        height: 1,
        backgroundColor: '#E0E0E0', // Light gray divider
        marginVertical: spacing.md,
        marginHorizontal: spacing.lg,
    },

    logoutButton: {
        backgroundColor: Colors.red,
        marginHorizontal: spacing.lg,
        marginTop: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    logoutText: {
        fontSize: typography.md,
        fontWeight: '600',
        color: Colors.white,
    },

    // User Profile Styles
    userSection: {
        backgroundColor: Colors.white,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        borderRadius: 12,
        padding: spacing.lg,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    userProfile: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    userAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: spacing.md,
    },

    userInfo: {
        flex: 1,
    },

    userName: {
        fontSize: typography.lg,
        fontWeight: '600',
        color: '#2D2B2E',
        marginBottom: spacing.xs,
    },

    userEmail: {
        fontSize: typography.sm,
        color: Colors.gray,
        marginBottom: spacing.xs,
    },

    userProvider: {
        fontSize: typography.xs,
        color: Colors.red,
        fontWeight: '500',
    },
}); 