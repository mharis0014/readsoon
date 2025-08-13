import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { spacing, typography } from '../utils/responsive';

export const addLinkModalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        paddingHorizontal: spacing.lg,
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%' as any,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.mdd,
    },
    title: {
        fontSize: typography.lg,
        fontWeight: '700' as const,
        color: Colors.black,
    },
    closeButton: {
        width: typography.xxxxl,
        height: typography.xxxxl,
        borderRadius: 16,
        backgroundColor: Colors.lightGray,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    closeIcon: {
        fontSize: typography.lg,
        color: Colors.gray,
        fontWeight: 'bold' as const,
    },
    form: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    fieldContainer: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: typography.md,
        fontWeight: '600' as const,
        color: Colors.black,
        marginBottom: spacing.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        fontSize: typography.md,
        color: Colors.black,
        backgroundColor: Colors.white,
    },
    textArea: {
        minHeight: 80,
        paddingTop: spacing.md,
    },
    helperText: {
        fontSize: typography.sm,
        color: Colors.gray,
    },
    helpText: {
        fontSize: typography.sm,
        color: Colors.gray,
        textAlign: 'center',
        marginBottom: spacing.md,
        lineHeight: typography.sm * 1.4,
    },
    actions: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: Colors.lightGray,
        gap: spacing.md,
    },
    cancelButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.mediumGray,
        borderRadius: 8,
        paddingVertical: spacing.md,
        alignItems: 'center' as const,
        backgroundColor: Colors.white,
    },
    cancelButtonText: {
        fontSize: typography.md,
        fontWeight: '600' as const,
        color: Colors.gray,
    },
    saveButton: {
        flex: 1,
        backgroundColor: Colors.red,
        borderRadius: 8,
        paddingVertical: spacing.md,
        alignItems: 'center' as const,
    },
    saveButtonDisabled: {
        backgroundColor: Colors.mediumGray,
    },
    saveButtonText: {
        fontSize: typography.md,
        fontWeight: '600' as const,
        color: Colors.white,
    },
    loadingContainer: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: spacing.sm,
    },
    loadingText: {
        fontSize: typography.sm,
        color: Colors.white,
        fontWeight: '500',
    },
}); 