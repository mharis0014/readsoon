import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Colors from '../../constants/Colors';
import { useThemeColor } from '../../hooks/useThemeColor';
import { spacing, typography } from '../../utils/responsive';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    text?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
    showText?: boolean;
}

/**
 * Reusable loading spinner component
 */
export function LoadingSpinner({
    size = 'large',
    color,
    text,
    style,
    textStyle,
    showText = true,
}: LoadingSpinnerProps) {
    const defaultColor = useThemeColor({ light: Colors.blue, dark: Colors.blue }, 'text');
    const textColor = useThemeColor({ light: Colors.gray, dark: Colors.lightGray }, 'text');

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator
                size={size}
                color={color || defaultColor}
            />
            {showText && text && (
                <Text style={[styles.text, { color: textColor }, textStyle]}>
                    {text}
                </Text>
            )}
        </View>
    );
}

/**
 * Full screen loading spinner
 */
export function FullScreenSpinner({
    text = 'Loading...',
    ...props
}: Omit<LoadingSpinnerProps, 'showText'>) {
    return (
        <View style={styles.fullScreen}>
            <LoadingSpinner text={text} showText={true} {...props} />
        </View>
    );
}

/**
 * Inline loading spinner for buttons and small areas
 */
export function InlineSpinner({
    size = 'small',
    ...props
}: Omit<LoadingSpinnerProps, 'showText'>) {
    return (
        <LoadingSpinner
            size={size}
            showText={false}
            style={styles.inline}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
    },
    fullScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    inline: {
        padding: 0,
    },
    text: {
        marginTop: spacing.md,
        fontSize: typography.md,
        textAlign: 'center',
        lineHeight: 24,
    },
}); 