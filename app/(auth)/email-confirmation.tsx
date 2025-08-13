import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { AuthHeader } from '@/components/layout/AuthHeader';
import { ThemedText } from '../../components/layout/ThemedText';
import { CustomButton } from '../../components/ui/CustomButton';
import { Colors } from '../../constants/Colors';
import { authStyles } from '../../styles/auth';

export default function EmailConfirmationScreen() {
    const router = useRouter();

    const handleBackToLogin = () => {
        router.push('/(auth)/login');
    };

    const handleBackToSignup = () => {
        router.push('/(auth)/signup');
    };

    return (
        <View style={authStyles.container}>
            <StatusBar style="light" />

            <AuthHeader
                title="VERIFY EMAIL"
                subtitle="Check your email to continue"
                showBackButton={true}
                onBackPress={handleBackToLogin}
            />

            <View style={authStyles.content}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView
                        contentContainerStyle={authStyles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Email Icon */}
                        <View style={styles.iconContainer}>
                            <View style={styles.iconBackground}>
                                <Ionicons name="mail" size={48} color={Colors.red} />
                            </View>
                        </View>

                        {/* Main Message */}
                        <View style={styles.messageContainer}>
                            <ThemedText style={styles.title}>
                                Verify Your Email Address
                            </ThemedText>
                            <ThemedText style={styles.description}>
                                We&apos;ve sent a confirmation email to your address. Please check your inbox and click the verification link to activate your account.
                            </ThemedText>
                        </View>

                        {/* Action Button */}
                        <CustomButton
                            title="BACK TO LOGIN"
                            onPress={handleBackToLogin}
                            variant="filled"
                            fullWidth
                            style={authStyles.button}
                        />

                        {/* Footer */}
                        <View style={authStyles.footerContainer}>
                            <Text style={authStyles.footerText}>
                                Need to create a new account?{' '}
                                <Text
                                    style={authStyles.footerLink}
                                    onPress={handleBackToSignup}
                                >
                                    Sign Up
                                </Text>
                            </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}

const styles = {
    iconContainer: {
        alignItems: 'center' as const,
        marginBottom: 32,
    },
    iconBackground: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    messageContainer: {
        alignItems: 'center' as const,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        color: Colors.gray,
        textAlign: 'center' as const,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: Colors.gray,
        textAlign: 'center' as const,
        lineHeight: 24,
        opacity: 0.8,
    },
};
