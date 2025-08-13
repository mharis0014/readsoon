import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { spacing, typography } from '../utils/responsive';

export const topPicksStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        backgroundColor: Colors.red,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.xxl + spacing.md, // Extra padding for status bar
        paddingBottom: spacing.md,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        color: Colors.white,
        fontSize: typography.xl,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 24,
    },
    gridContainer: {
        paddingVertical: spacing.sm,
        paddingHorizontal: 20,
    },
    cardContainer: {
        width: 110,
        marginBottom: 15,
        marginHorizontal: 7.5,
    },
    topPickCard: {
        alignItems: 'center',
    },
    topPickImage: {
        width: 110,
        height: 145,
        borderRadius: 12,
    },
    topPickTitle: {
        marginTop: 8,
        fontSize: typography.xs,
        fontWeight: '500',
        textAlign: 'center',
        width: 110, // Match card width
    },
});