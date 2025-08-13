import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../../constants/Colors';
import { spacing, typography } from '../../utils/responsive';

export type SignInButtonProvider = 'email' | 'phone' | 'apple' | 'google' | 'facebook';

interface SocialSignInButtonProps {
    provider: SignInButtonProvider;
    icon: any;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
}

export const SocialSignInButton: React.FC<SocialSignInButtonProps> = ({
    provider,
    icon,
    onPress,
    loading = false,
    disabled = false,
}) => {
    const getButtonText = () => {
        if (loading) {
            return `Signing in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`;
        }
        return `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`;
    };

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={disabled || loading}
        >
            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.buttonText}>{getButtonText()}</Text>
                </View>
            ) : (
                <>
                    <Image source={icon} style={styles.icon} />
                    <Text style={styles.buttonText}>{getButtonText()}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
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
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    buttonText: {
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
});
