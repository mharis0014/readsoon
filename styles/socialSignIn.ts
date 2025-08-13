import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { spacing, typography } from '../utils/responsive';

export const socialSignInStyles = StyleSheet.create({
    button: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.gray,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: spacing.lg,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        fontSize: typography.md,
        color: Colors.gray,
        fontWeight: '500',
        marginLeft: 12,
    },
}); 