import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { spacing, typography } from '@/utils/responsive';
import { AuthHeader } from '../../components/layout/AuthHeader';
import { ThemedText } from '../../components/layout/ThemedText';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomInput } from '../../components/ui/CustomInput';
import { Colors } from '../../constants/Colors';
import { supabase } from '../../lib/supabase';
import { authStyles } from '../../styles/auth';
import { showErrorAlert } from '../../utils/errorHandling';
import { StorageHelpers } from '../../utils/secureStorage';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadSavedEmail = async () => {
            try {
                const savedEmail = await StorageHelpers.getSavedEmail();
                if (savedEmail) {
                    setEmail(savedEmail);
                }
            } catch (error) {
                console.error('Error loading saved email:', error);
            }
        };

        loadSavedEmail();
    }, []);

    const handleResetPassword = async () => {
        if (!email.trim()) {
            showErrorAlert(new Error('Please enter your email first'), {
                title: 'Email Required',
                message: 'Please enter your email address to reset your password',
                cancelText: 'OK',
            });
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'readsoon://auth/reset-password',
            });

            if (error) throw error;

            showErrorAlert(new Error('Password reset email sent'), {
                title: 'Check Your Email',
                message: 'We\'ve sent a password reset link to your email address',
                cancelText: 'OK',
            });
        } catch (error) {
            showErrorAlert(error as Error, {
                title: 'Password Reset Failed',
                message: 'Unable to send password reset email. Please try again.',
                retryText: 'Try Again',
                cancelText: 'Cancel',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        router.push('/(auth)/login');
    };

    return (
        <View style={authStyles.container}>
            <StatusBar style="light" />

            <AuthHeader
                title="RESET PASSWORD"
                subtitle="Enter your email to continue"
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
                        {/* Lock Icon */}
                        <View style={styles.iconContainer}>
                            <View style={styles.iconBackground}>
                                <Ionicons name="lock-open" size={48} color={Colors.red} />
                            </View>
                        </View>

                        {/* Main Message */}
                        <View style={styles.messageContainer}>
                            <ThemedText style={styles.title}>
                                Forgot Your Password?
                            </ThemedText>
                            <ThemedText style={styles.description}>
                                No worries! Enter your email address and we&apos;ll send you a link to reset your password.
                            </ThemedText>
                        </View>

                        {/* Email Input */}
                        <CustomInput
                            label="Your Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email address"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={authStyles.inputText}
                            containerStyle={authStyles.inputContainer}
                            leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.gray} />}
                        />

                        {/* Action Button */}
                        <CustomButton
                            title="RESET PASSWORD"
                            onPress={handleResetPassword}
                            loading={isLoading}
                            disabled={isLoading}
                            variant="filled"
                            fullWidth
                            style={authStyles.button}
                        />

                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}

const styles = {
    iconContainer: {
        alignItems: 'center' as const,
        marginBottom: spacing.xl,
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
        marginBottom: spacing.xxl,
        paddingHorizontal: spacing.mdd,
    },
    title: {
        fontSize: typography.xxl,
        fontWeight: 'bold' as const,
        color: Colors.gray,
        textAlign: 'center' as const,
        marginBottom: spacing.smd,
    },
    description: {
        fontSize: typography.sm,
        color: Colors.gray,
        textAlign: 'center' as const,
        lineHeight: spacing.lg,
        opacity: 0.8,
    },
};
