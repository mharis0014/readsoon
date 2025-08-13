import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { spacing } from '../utils/responsive';

export const articleListStyles = StyleSheet.create({
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
    headerTitle: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
    backButton: {
        padding: spacing.xs,
    },
    placeholder: {
        width: 24,
    },
    listContent: {
        paddingHorizontal: 20,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: spacing.xxl * 2,
    },
    emptyStateText: {
        fontSize: 16,
        color: Colors.gray,
        textAlign: 'center',
        marginTop: spacing.md,
    },
});