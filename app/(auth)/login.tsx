import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '../../components/layout/ThemedText';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomInput } from '../../components/ui/CustomInput';
import { Colors } from '../../constants/Colors';
import { useLoginValidation } from '../../hooks/useAuthValidation';
import { useHybridAuth } from '../../services/hybridAuthService';
import { authStyles } from '../../styles/auth';
import { showErrorAlert } from '../../utils/errorHandling';
import { typography } from '../../utils/responsive';
import { StorageHelpers } from '../../utils/secureStorage';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const { loginWithEmail, isLoading } = useHybridAuth();
    const { errors, validateLogin, clearFieldError } = useLoginValidation();
    const router = useRouter();

    useEffect(() => {
        const loadRememberMePreferences = async () => {
            try {
                const savedRememberMe = await StorageHelpers.getRememberMe();
                setRememberMe(savedRememberMe);

                if (savedRememberMe) {
                    const savedEmail = await StorageHelpers.getSavedEmail();
                    if (savedEmail) setEmail(savedEmail);
                }
            } catch (error) {
                console.error('Error loading remember me preferences:', error);
            }
        };

        loadRememberMePreferences();
    }, []);

    const handleLogin = useCallback(async () => {
        if (!validateLogin(email, password)) return;

        try {
            await loginWithEmail(email, password, rememberMe);
            // Login was successful - navigation will be handled by auth context
        } catch (error) {
            console.error('Login error details:', error);

            if (error instanceof Error) {
                showErrorAlert(error, {
                    title: 'Login Failed',
                    message: 'Please check your credentials and try again',
                    retryText: 'Try Again',
                    cancelText: 'Cancel',
                });
            }
        }
    }, [email, password, rememberMe, loginWithEmail, validateLogin]);

    const handleSignup = () => {
        router.push('/(auth)/signup');
    };

    const handleForgotPassword = () => {
        router.push('/(auth)/forgot-password');
    };

    return (
        <View style={authStyles.container}>
            <StatusBar style="light" />

            <View style={authStyles.header}>

                <View style={authStyles.overlayLarge} />
                <View style={authStyles.overlaySmall} />

                <ThemedText style={authStyles.headerTitle}>
                    SIGN IN
                </ThemedText>
                <ThemedText style={authStyles.headerSubtitle}>
                    Login to your existing account
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
                        <CustomInput
                            label="Your Email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (errors.email) clearFieldError('email');
                            }}
                            placeholder="Enter Your Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={errors.email}
                            style={authStyles.inputText}
                            containerStyle={authStyles.inputContainer}
                            leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.gray} />}
                        />

                        <CustomInput
                            label="Your Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) clearFieldError('password');
                            }}
                            placeholder="Enter Your Password"
                            isPassword
                            error={errors.password}
                            style={authStyles.inputText}
                            containerStyle={authStyles.inputContainer}
                            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.gray} />}
                        />

                        <View style={authStyles.rememberSection}>
                            <TouchableOpacity
                                style={authStyles.rememberContainer}
                                onPress={() => setRememberMe(!rememberMe)}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        authStyles.checkbox,
                                        rememberMe ? authStyles.checkboxChecked : authStyles.checkboxUnchecked,
                                    ]}
                                >
                                    {rememberMe && (
                                        <Ionicons name="checkmark" size={typography.xs} color={Colors.white} />
                                    )}
                                </View>
                                <Text style={authStyles.rememberText}>
                                    Remember me
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.7} onPress={handleForgotPassword}>
                                <Text style={authStyles.forgotPasswordText}>
                                    Password forgotten?
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <CustomButton
                            title="SIGN IN"
                            onPress={handleLogin}
                            loading={isLoading}
                            disabled={isLoading}
                            variant="filled"
                            fullWidth
                            style={authStyles.button}
                        />

                        <View style={authStyles.footerContainer}>
                            <Text style={authStyles.footerText}>
                                Don&apos;t have an account?{' '}
                                <Text
                                    style={authStyles.footerLink}
                                    onPress={handleSignup}
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
