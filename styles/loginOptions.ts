import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { spacing, typography } from '../utils/responsive';

export const loginOptionsStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.red,
    },
    header: {
        backgroundColor: Colors.red,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xxxxxl,
        paddingBottom: spacing.lg,
        position: 'relative',
    },
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
    },
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
    content: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: 0,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.mdd,
        marginBottom: spacing.mdd,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    optionIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    optionText: {
        fontSize: typography.md,
        color: '#4B5563',
        fontWeight: '500',
        marginLeft: spacing.md,
        flex: 1,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.lg,
        marginBottom: spacing.xxl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        fontSize: typography.sm,
        color: '#6B7280',
        marginHorizontal: spacing.md,
        fontWeight: '500',
    },
    footerContainer: {
        alignItems: 'center',
        marginTop: spacing.xl,
        marginBottom: spacing.xxxl,
    },
    footerText: {
        fontSize: typography.sm,
        color: '#6B7280',
    },
    footerLink: {
        color: Colors.red,
        fontWeight: '600',
    },
});
