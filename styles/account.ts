import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { SCREEN_HEIGHT, spacing, typography } from '../utils/responsive';

export const accountStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },

    // Header
    header: {
        backgroundColor: Colors.red,
        paddingHorizontal: spacing.lg,
        paddingTop: SCREEN_HEIGHT * 0.08,
        paddingBottom: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerTitle: {
        color: Colors.white,
        fontSize: typography.lg,
        fontWeight: '600',
    },

    headerSpacer: {
        width: 40,
    },

    // Scroll View
    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
    },

    // Profile Card
    profileCard: {
        backgroundColor: Colors.white,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        borderRadius: 16,
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },

    profileAvatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: spacing.lg,
    },

    profileInfo: {
        flex: 1,
    },

    profileName: {
        fontSize: typography.lg,
        fontWeight: '600',
        color: '#2D2B2E',
        marginBottom: spacing.xs,
    },

    profileEmail: {
        fontSize: typography.sm,
        color: Colors.gray,
        marginBottom: spacing.sm,
    },

    profileBadge: {
        backgroundColor: Colors.red,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },

    profileBadgeText: {
        fontSize: typography.xs,
        color: Colors.white,
        fontWeight: '500',
    },

    // Sections
    section: {
        marginBottom: spacing.lg,
    },

    sectionTitle: {
        fontSize: typography.md,
        fontWeight: '600',
        color: '#2D2B2E',
        marginHorizontal: spacing.lg,
        marginBottom: spacing.sm,
    },

    // Setting Items
    settingItem: {
        backgroundColor: Colors.white,
        marginHorizontal: spacing.lg,
        marginBottom: 1,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    settingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },

    settingText: {
        flex: 1,
    },

    settingTitle: {
        fontSize: typography.md,
        fontWeight: '500',
        color: '#2D2B2E',
        marginBottom: spacing.xs,
    },

    settingSubtitle: {
        fontSize: typography.sm,
        color: Colors.gray,
    },

    // Danger Zone
    dangerItem: {
        backgroundColor: Colors.white,
        marginHorizontal: spacing.lg,
        marginBottom: 1,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeftWidth: 3,
        borderLeftColor: Colors.red,
    },

    dangerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },

    dangerTitle: {
        fontSize: typography.md,
        fontWeight: '500',
        color: Colors.red,
        marginBottom: spacing.xs,
    },

    dangerSubtitle: {
        fontSize: typography.sm,
        color: Colors.gray,
    },
});
