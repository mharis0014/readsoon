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
    // Default renderer HTML
    const formattedContent = useMemo(
        () => htmlContent || formatDescription(content),
        [content, htmlContent]
    );

    return (
        <RenderHTML
            contentWidth={360}
            source={{ html: formattedContent }}
            tagsStyles={{
                h1: {
                    fontSize: typography.xxl,
                    fontWeight: 'bold',
                    marginBottom: spacing.md,
                    marginTop: spacing.lg
                },
                h2: {
                    fontSize: typography.lg,
                    fontWeight: 'bold',
                    marginBottom: spacing.smd,
                    marginTop: spacing.lg
                },
                h3: {
                    fontSize: typography.md,
                    fontWeight: 'bold',
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
                    textAlign: 'left',
                    marginTop: spacing.smd
                },
                ul: {
                    marginBottom: 20,
                    paddingLeft: 20,
                    marginTop: 8,
                    listStyleType: 'disc'
                },
                ol: {
                    marginBottom: 20,
                    paddingLeft: 20,
                    listStyleType: 'decimal',
                    marginTop: 8
                },
            }}
        />
    );
}
