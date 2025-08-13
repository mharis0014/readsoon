import { formatDescription } from '@/utils/articleContentHelpers';
import { spacing, typography } from '@/utils/responsive';
import React, { useMemo } from 'react';
import { RenderHTML } from 'react-native-render-html';

interface DefaultModeContentProps {
    content: string;
    htmlContent?: string;
}

export default function DefaultModeContent({
    content,
    htmlContent,
}: DefaultModeContentProps) {
    const formattedContent = useMemo(
        () => htmlContent || formatDescription(content),
        [content, htmlContent]
    );

    const source = useMemo(() => ({ html: formattedContent }), [formattedContent]);

    const tagsStyles = useMemo(() => ({
        h1: {
            fontSize: typography.xxl,
            fontWeight: 'bold' as const,
            marginBottom: spacing.md,
            marginTop: spacing.lg
        },
        h2: {
            fontSize: typography.lg,
            fontWeight: 'bold' as const,
            marginBottom: spacing.smd,
            marginTop: spacing.lg
        },
        h3: {
            fontSize: typography.md,
            fontWeight: 'bold' as const,
            marginBottom: spacing.smd,
            marginTop: spacing.lg
        },
        p: {
            fontSize: typography.md,
            lineHeight: 24,
            marginBottom: spacing.md,
            marginTop: spacing.smd
        },
        li: {
            fontSize: typography.md,
            lineHeight: 24,
            marginBottom: spacing.md,
            paddingLeft: 12,
            paddingRight: 8,
            textAlign: 'left' as const,
            marginTop: spacing.smd
        },
        ul: {
            marginBottom: 20,
            paddingLeft: 20,
            marginTop: 8,
            listStyleType: 'disc' as const
        },
        ol: {
            marginBottom: 20,
            paddingLeft: 20,
            listStyleType: 'decimal' as const,
            marginTop: 8
        },
    }), []);

    return (
        <RenderHTML
            contentWidth={360}
            source={source}
            tagsStyles={tagsStyles}
        />
    );
}
