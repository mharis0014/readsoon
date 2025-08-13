import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { SCREEN_HEIGHT, spacing, typography } from '../utils/responsive';

export const audioStyles = StyleSheet.create({
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
        paddingTop: SCREEN_HEIGHT * 0.08,
        paddingBottom: spacing.lg,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },

    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerTitle: {
        color: Colors.white,
        fontSize: typography.xxl,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },

    placeholder: {
        width: 40,
        height: 40,
    },

    content: {
        flex: 1,
        paddingTop: spacing.lg,
    },

    section: {
        marginBottom: spacing.lg,
    },

    sectionHeader: {
        backgroundColor: '#FFF5F5', // Light red background
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
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        backgroundColor: Colors.white,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F0F0F0',
    },

    settingText: {
        fontSize: typography.lg,
        color: Colors.black,
        fontWeight: '400',
    },

    settingValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    valueText: {
        fontSize: typography.md,
        color: Colors.gray,
        marginRight: spacing.xs,
    },
}); 