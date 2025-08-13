import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { SCREEN_HEIGHT, spacing, typography } from '../utils/responsive';

export const authStyles = StyleSheet.create({
    // Container styles
    container: {
        flex: 1,
        backgroundColor: Colors.red,
    },

    // Header styles
    header: {
        backgroundColor: Colors.red,
        paddingHorizontal: spacing.xl,
        paddingTop: 60,
        paddingBottom: 30,
        position: 'relative',
    },

    // Overlay patterns
    overlayLarge: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
    },

    overlaySmall: {
        position: 'absolute',
        top: 60,
        right: 120,
        width: 60,
        height: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
    },

    // Header text styles
    headerTitle: {
        fontSize: typography.xxl,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 6,
    },

    headerSubtitle: {
        fontSize: typography.sm,
        color: Colors.white,
        opacity: 0.9,
    },

    // Content area styles
    content: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 32,
    },

    // ScrollView styles
    scrollContent: {
        flexGrow: 1,
        paddingBottom: spacing.xxl,
        justifyContent: 'center',
    },

    // Google Sign In Button styles
    googleButton: {
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

    googleButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    googleButtonText: {
        fontSize: typography.md,
        color: Colors.gray,
        fontWeight: '500',
        marginLeft: 12,
    },

    // Divider styles
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.lg,
    },

    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.gray,
        opacity: 0.3,
    },

    dividerText: {
        fontSize: typography.sm,
        color: Colors.gray,
        marginHorizontal: spacing.md,
        fontWeight: '500',
    },

    // Input styles
    inputContainer: {
        marginBottom: 28,
    },

    inputText: {
        fontSize: 13,
    },

    // Remember me section
    rememberSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },

    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderColor: Colors.gray,
        borderRadius: 3,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    checkboxChecked: {
        backgroundColor: Colors.red,
    },

    checkboxUnchecked: {
        backgroundColor: 'transparent',
    },

    rememberText: {
        fontSize: 13,
        color: Colors.gray,
    },

    forgotPasswordText: {
        fontSize: 13,
        color: Colors.red,
        fontWeight: '500',
    },

    // Button styles
    button: {
        marginTop: SCREEN_HEIGHT * 0.15,
    },

    // Footer link styles
    footerContainer: {
        alignItems: 'center',
        marginTop: spacing.xl,
    },

    footerText: {
        fontSize: 13,
        color: Colors.gray,
    },

    footerLink: {
        color: Colors.red,
        fontWeight: '600',
    },
}); 