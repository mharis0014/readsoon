import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { ThemedText } from '../../components/layout/ThemedText';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomInput } from '../../components/ui/CustomInput';
import { Colors } from '../../constants/Colors';
import { supabase } from '../../lib/supabase';
import { authStyles } from '../../styles/auth';
import { showErrorAlert } from '../../utils/errorHandling';
import { screen } from '../../utils/responsive';

export default function SetPasswordScreen() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

    const router = useRouter();
    const { email, username } = useLocalSearchParams<{ email: string; username: string }>();

    const validatePassword = () => {
        const newErrors: { password?: string; confirmPassword?: string } = {};

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearFieldError = (field: keyof typeof errors) => {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleSetPassword = async () => {
        if (!validatePassword()) return;

        setIsLoading(true);
        try {
            // First, check if user is logged in
            const { data: currentUser } = await supabase.auth.getUser();

            if (!currentUser.user) {
                // User is not logged in - they need to log in with Google first
                showErrorAlert(new Error('Authentication required'), {
                    title: 'Please Sign In First',
                    message: 'You need to sign in with Google to set a password for your account.',
                    retryText: 'Sign In with Google',
                    cancelText: 'Cancel',
                    onRetry: async () => {
                        try {
                            // Sign in with Google
                            const { data, error } = await supabase.auth.signInWithOAuth({
                                provider: 'google',
                                options: {
                                    redirectTo: 'readsoon://auth/callback',
                                    skipBrowserRedirect: true,
                                },
                            });

                            if (error) {
                                throw error;
                            }

                            if (data?.url) {
                                const result = await WebBrowser.openAuthSessionAsync(
                                    data.url,
                                    'readsoon://auth/callback'
                                );

                                if (result.type === 'success' && result.url) {
                                    const url = new URL(result.url);
                                    const searchParams = url.searchParams;
                                    let access_token = searchParams.get('access_token');
                                    let refresh_token = searchParams.get('refresh_token');

                                    if (!access_token && url.hash) {
                                        const fragment = url.hash.substring(1);
                                        const fragmentParams = new URLSearchParams(fragment);
                                        access_token = fragmentParams.get('access_token');
                                        refresh_token = fragmentParams.get('refresh_token');
                                    }

                                    if (access_token) {
                                        // Set the session
                                        const { error: sessionError } = await supabase.auth.setSession({
                                            access_token,
                                            refresh_token: refresh_token || '',
                                        });

                                        if (sessionError) {
                                            throw sessionError;
                                        }

                                        // Now try to set the password again
                                        await handleSetPassword();
                                    } else {
                                        throw new Error('Failed to authenticate with Google');
                                    }
                                } else {
                                    throw new Error('Google authentication was cancelled');
                                }
                            } else {
                                throw new Error('Failed to start Google authentication');
                            }
                        } catch (authError) {
                            showErrorAlert(authError as Error, {
                                title: 'Authentication Failed',
                                message: 'Please try signing in with Google again.',
                                retryText: 'Try Again',
                                cancelText: 'Cancel',
                            });
                        }
                    }
                });
                return;
            }

            // User is logged in - update the password
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
                data: {
                    username: username,
                }
            });

            if (updateError) {
                throw updateError;
            }

            // Update profile with username
            const { data: userData } = await supabase.auth.getUser();
            if (userData.user?.id) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: userData.user.id,
                        username: username,
                    }, { onConflict: 'id' });

                if (profileError) {
                    console.warn('Failed to update profile:', profileError);
                }
            }

            showErrorAlert(new Error('Password set successfully'), {
                title: 'Success!',
                message: 'Your password has been set. You can now sign in with either Google or email/password.',
                cancelText: 'OK',
            });

            // Navigation will be handled by auth context automatically
        } catch (error) {
            console.error('Set password error:', error);
            showErrorAlert(error as Error, {
                title: 'Failed to Set Password',
                message: 'Please try again.',
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

            <View style={authStyles.header}>
                <View style={authStyles.overlayLarge} />
                <View style={authStyles.overlaySmall} />

                <ThemedText style={authStyles.headerTitle}>
                    SET PASSWORD
                </ThemedText>
                <ThemedText style={authStyles.headerSubtitle}>
                    Add password to your account
                </ThemedText>
            </View>

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
                        <View style={{ marginBottom: 20 }}>
                            <ThemedText style={{
                                textAlign: 'center',
                                color: Colors.gray,
                                fontSize: 16,
                                marginBottom: 10
                            }}>
                                Account exists for:
                            </ThemedText>
                            <ThemedText style={{
                                textAlign: 'center',
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: 'bold'
                            }}>
                                {email}
                            </ThemedText>
                        </View>

                        <CustomInput
                            label="New Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) clearFieldError('password');
                            }}
                            placeholder="Enter your new password"
                            isPassword
                            error={errors.password}
                            style={authStyles.inputText}
                            containerStyle={authStyles.inputContainer}
                            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.gray} />}
                        />

                        <CustomInput
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                if (errors.confirmPassword) clearFieldError('confirmPassword');
                            }}
                            placeholder="Confirm your new password"
                            isPassword
                            error={errors.confirmPassword}
                            style={authStyles.inputText}
                            containerStyle={authStyles.inputContainer}
                            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.gray} />}
                        />

                        <CustomButton
                            title="SET PASSWORD"
                            onPress={handleSetPassword}
                            loading={isLoading}
                            disabled={isLoading}
                            variant="filled"
                            fullWidth
                            style={{
                                ...authStyles.button,
                                marginTop: screen.height * 0.05
                            }}
                        />

                        <View style={authStyles.footerContainer}>
                            <Text style={authStyles.footerText}>
                                Already have a password?{' '}
                                <Text
                                    style={authStyles.footerLink}
                                    onPress={handleBackToLogin}
                                >
                                    Sign In
                                </Text>
                            </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}
