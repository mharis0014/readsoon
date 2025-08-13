import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { ThemedText } from '../../components/layout/ThemedText';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomInput } from '../../components/ui/CustomInput';
import { Colors } from '../../constants/Colors';
import { useSignupValidation } from '../../hooks/useAuthValidation';
import { useHybridAuth } from '../../services/hybridAuthService';
import { authStyles } from '../../styles/auth';
import { showErrorAlert } from '../../utils/errorHandling';
import { screen } from '../../utils/responsive';

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { signupWithEmail, isLoading } = useHybridAuth();
    const router = useRouter();
    const { errors, validateSignup, clearFieldError } = useSignupValidation();

    const handleSignup = async () => {
        if (!validateSignup(email, username, password, confirmPassword)) return;

        try {
            const result = await signupWithEmail(email, password, username);

            if (result.success) {
                if (result.requiresConfirmation) {
                    router.push('/(auth)/email-confirmation');
                } else if (result.session) {
                    showErrorAlert(new Error('Account created successfully'), {
                        title: 'Welcome!',
                        message: 'Your account has been created and you are now signed in.',
                        cancelText: 'OK',
                    });
                } else if (result.message) {
                    showErrorAlert(new Error('Account created successfully'), {
                        title: 'Account Created',
                        message: result.message,
                        cancelText: 'OK',
                    });
                    router.push('/(auth)/login');
                }
            }
        } catch (error) {
            console.error('Signup error:', error);
            console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');

            if (error instanceof Error && error.message === 'User already registered') {
                router.push({
                    pathname: '/(auth)/set-password',
                    params: { email, username }
                });
                return;
            }

            if (error instanceof Error && error.message === 'Email already registered') {
                showErrorAlert(new Error('Account already exists'), {
                    title: 'Account Exists',
                    message: 'This email is already registered. Please sign in instead.',
                    cancelText: 'OK',
                });
                router.push('/(auth)/login');
                return;
            }

            showErrorAlert(error as Error, {
                title: 'Signup Failed',
                message: 'Please check your information and try again',
                retryText: 'Try Again',
                cancelText: 'Cancel',
            });
        }
    };

    const handleSignIn = () => {
        router.push('/(auth)/login');
    };

    return (
        <View style={authStyles.container}>
            <StatusBar style="light" />

            <View style={authStyles.header}>

                <View style={authStyles.overlayLarge} />
                <View style={authStyles.overlaySmall} />

                <ThemedText style={authStyles.headerTitle}>
                    SIGN UP
                </ThemedText>
                <ThemedText style={authStyles.headerSubtitle}>
                    Create your new account
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
                            label="Your Name"
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                if (errors.username) clearFieldError('username');
                            }}
                            placeholder="Enter Your Name"
                            autoCapitalize="words"
                            error={errors.username}
                            style={authStyles.inputText}
                            containerStyle={authStyles.inputContainer}
                            leftIcon={<Ionicons name="person-outline" size={20} color={Colors.gray} />}
                        />

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

                        <CustomInput
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                if (errors.confirmPassword) clearFieldError('confirmPassword');
                            }}
                            placeholder="Confirm Your Password"
                            isPassword
                            error={errors.confirmPassword}
                            style={authStyles.inputText}
                            containerStyle={authStyles.inputContainer}
                            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.gray} />}
                        />

                        <CustomButton
                            title="SIGN UP"
                            onPress={handleSignup}
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
                                Have an account?{' '}
                                <Text
                                    style={authStyles.footerLink}
                                    onPress={handleSignIn}
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
