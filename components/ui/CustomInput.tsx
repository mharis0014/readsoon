import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ViewStyle
} from 'react-native';

interface CustomInputProps extends TextInputProps {
    label?: string;
    iconName?: React.ComponentProps<typeof Ionicons>['name'];
    leftIcon?: React.ReactNode;
    isPassword?: boolean;
    error?: string;
    containerStyle?: ViewStyle;
    labelStyle?: TextStyle;
    errorStyle?: TextStyle;
}

export function CustomInput({
    label,
    iconName,
    leftIcon,
    isPassword = false,
    error,
    containerStyle,
    labelStyle,
    errorStyle,
    style,
    ...props
}: CustomInputProps) {
    const [secure, setSecure] = useState(isPassword);
    const inputRef = useRef<TextInput>(null);

    // Render either your passed-in ReactNode or a default Ionicon  
    const renderLeftIcon = () => {
        if (leftIcon) return <View style={styles.leftIcon}>{leftIcon}</View>;
        if (iconName)
            return (
                <Ionicons
                    name={iconName}
                    size={22}
                    color="#637381"
                    style={styles.leftIcon}
                />
            );
        return null;
    };

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <View style={[styles.wrapper, containerStyle]}>
            {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}

            <TouchableWithoutFeedback onPress={focusInput}>
                <View style={[
                    styles.inputContainer,
                    props.multiline ? styles.multilineContainer : styles.singleLineContainer
                ]}>
                    {renderLeftIcon()}

                    <TextInput
                        ref={inputRef}
                        style={[styles.input, style]}
                        placeholderTextColor="#CACEDC"
                        secureTextEntry={secure}
                        {...props}
                    />

                    {isPassword && (
                        <TouchableOpacity
                            onPress={() => setSecure(s => !s)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons
                                name={secure ? 'eye-off-outline' : 'eye-outline'}
                                size={22}
                                color="#637381"
                                style={styles.rightIcon}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableWithoutFeedback>

            {!!error && (
                <Text style={[styles.errorText, errorStyle]}>
                    {error}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 6,
        fontSize: 14,
        color: '#1A202C',
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: 0.94,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    leftIcon: {
        marginRight: 12,
    },
    rightIcon: {
        marginLeft: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1A202C',
    },
    errorText: {
        marginTop: 4,
        fontSize: 12,
        color: '#E53E3E',
    },
    multilineContainer: {
        minHeight: 100,
        alignItems: 'flex-start',
    },
    singleLineContainer: {
        height: 58,
        alignItems: 'center',
    },
});
