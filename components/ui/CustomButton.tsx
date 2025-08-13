import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextStyle,
    ViewStyle,
} from 'react-native';

type ButtonVariant = 'filled' | 'outlined';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
}

export function CustomButton({
    title,
    onPress,
    variant = 'filled',
    fullWidth = false,
    disabled = false,
    loading = false,
    style,
    textStyle,
    backgroundColor,
    textColor,
    borderColor,
}: CustomButtonProps) {
    const isOutlined = variant === 'outlined';

    // Default colors based on variant
    const defaultBgColor = isOutlined ? 'transparent' : '#FF474C';
    const defaultTextColor = isOutlined ? '#FFFFFF' : '#FFFFFF';
    const defaultBorderColor = isOutlined ? '#FFFFFF' : 'transparent';

    // Use custom colors if provided, otherwise use defaults
    const finalBgColor = backgroundColor || defaultBgColor;
    const finalTextColor = textColor || defaultTextColor;
    const finalBorderColor = borderColor || defaultBorderColor;

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.base,
                fullWidth && { width: '100%' },
                {
                    backgroundColor: finalBgColor,
                    borderWidth: isOutlined ? 2 : 0,
                    borderColor: finalBorderColor,
                },
                disabled && { opacity: 0.6 },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={finalTextColor} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        { color: finalTextColor },
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
