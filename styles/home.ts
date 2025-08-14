import { Colors } from '@/constants/Colors';
import { SCREEN_HEIGHT, SCREEN_WIDTH, spacing, TAB_BAR_HEIGHT, typography } from '@/utils/responsive';
import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
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
    greeting: {
        color: Colors.white,
        fontSize: typography.xxl,
        fontWeight: 'bold',
    },
    subtitle: {
        color: Colors.white,
        fontSize: typography.md,
        marginTop: spacing.xs,
    },
    goalCard: {
        backgroundColor: Colors.white,
        marginHorizontal: spacing.lg,
        borderRadius: 12,
        padding: spacing.md,
        marginTop: spacing.lg,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    goalTitle: {
        fontSize: typography.lg,
        fontWeight: 'bold',
    },
    goalIcon: {
        width: 32,
        height: 32,
        borderRadius: 20,
        backgroundColor: Colors.red,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookIcon: {
        width: typography.lg,
        height: typography.lg,
    },
    goalText: {
        fontSize: typography.sm,
        marginTop: spacing.sm,
        marginBottom: 13,
        fontWeight: '400'
    },
    progressContainer: {
        marginBottom: spacing.sm,
    },
    percentage: {
        color: Colors.gray,
        marginTop: spacing.sm,
    },
    sectionHeader: {
        marginTop: spacing.lg,
        marginHorizontal: spacing.md,
        marginBottom: spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: typography.xxl,
        fontWeight: 'bold',
    },
    seeAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeAllText: {
        color: Colors.red,
        fontWeight: '500',
    },
    topPickCard: {
        marginRight: spacing.md,
        alignItems: 'center',
    },
    topPickImage: {
        width: 160,
        height: 214,
        borderRadius: 12,
    },
    topPickTitle: {
        marginTop: 8,
        fontSize: typography.md,
        fontWeight: 'bold',
    },
    staffCard: {
        width: SCREEN_WIDTH * 0.83,
        height: SCREEN_HEIGHT * 0.373,
        marginRight: spacing.md,
        position: 'relative',
        backgroundColor: Colors.red,
        borderRadius: 24,
    },
    staffImage: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
    },
    staffOverlay: {
        position: 'absolute',
        top: spacing.md,
        left: spacing.md,
        right: spacing.md,
        bottom: spacing.md,
        justifyContent: 'flex-end',
    },
    dateBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: Colors.white,
        paddingHorizontal: spacing.xs,
        paddingVertical: spacing.xs,
        borderRadius: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 50,
    },
    dateNumber: {
        fontSize: typography.lg,
        fontWeight: 'bold',
        color: Colors.black,
        textAlign: 'center',
    },
    dateMonth: {
        fontSize: typography.sm,
        color: Colors.black,
        textAlign: 'center',
    },
    staffContent: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: spacing.md,
        borderRadius: 12,
    },
    staffAuthor: {
        fontSize: typography.sm,
        color: Colors.white,
        marginBottom: spacing.xs,
    },
    staffTitle: {
        fontSize: typography.lg,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: spacing.xs,
    },
    staffDesc: {
        fontSize: typography.md,
        color: Colors.white,
    },
    horizontalList: {
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
    },
    emptyState: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
        alignItems: 'center' as const,
    },
    emptyStateText: {
        fontSize: typography.md,
        color: Colors.gray,
        textAlign: 'center' as const,
    },
});