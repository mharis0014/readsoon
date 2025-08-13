import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { SCREEN_HEIGHT, spacing, typography } from '../utils/responsive';

export const notificationStyles = StyleSheet.create({
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
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
    },

    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        backgroundColor: Colors.white,
    },

    settingText: {
        fontSize: typography.lg,
        color: Colors.black,
        fontWeight: '400',
    },

    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginHorizontal: spacing.lg,
    },
}); 