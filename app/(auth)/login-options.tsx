import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { SocialSignInButton } from '@/components/ui/SocialSignInButton';
import ICONS from '../../constants/Icons';

import { useHybridAuth } from '../../services/hybridAuthService';
import { loginOptionsStyles as styles } from '../../styles/loginOptions';
import { showErrorAlert } from '../../utils/errorHandling';

export default function LoginOptionsScreen() {
    const router = useRouter();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isAppleLoading, setIsAppleLoading] = useState(false);
    const [isFacebookLoading, setIsFacebookLoading] = useState(false);

    const { signInWithGoogle, signInWithFacebook } = useHybridAuth();

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        try {
            // Use Supabase OAuth first since it's more reliable for mobile
            await signInWithGoogle();
        } catch {
            showErrorAlert(new Error('Google login failed'), {
                title: 'Google Login Failed',
                message: 'Unable to sign in with Google. Please try again.',
                onRetry: handleGoogleLogin,
                retryText: 'Try Again',
                cancelText: 'Cancel',
            });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleAppleLogin = async () => {
        setIsAppleLoading(true);
        try {
            // TODO: Implement Apple OAuth with Supabase
            throw new Error('Apple login not implemented yet');
        } catch (error) {
            showErrorAlert(new Error('Apple login failed'), {
                title: 'Apple Login Failed',
                message: 'Apple login is not implemented yet',
                onRetry: handleAppleLogin,
                retryText: 'Try Again',
                cancelText: 'Cancel',
            });
        } finally {
            setIsAppleLoading(false);
        }
    };

    const handleFacebookLogin = async () => {
        setIsFacebookLoading(true);
        try {
            await signInWithFacebook();
        } catch (error) {
            showErrorAlert(new Error('Facebook login failed'), {
                title: 'Facebook Login Failed',
                message: 'Unable to sign in with Facebook. Please try again.',
                onRetry: handleFacebookLogin,
                retryText: 'Try Again',
                cancelText: 'Cancel',
            });
        } finally {
            setIsFacebookLoading(false);
        }
    };

    const handleEmailLogin = () => {
        router.push('/(auth)/login');
    };

    const handlePhoneLogin = () => {
        // Implement phone login navigation
        showErrorAlert(new Error('Not implemented'), {
            title: 'Phone Login',
            message: 'Phone login is not implemented yet',
            cancelText: 'OK',
        });
    };

    const handleSignup = () => {
        router.push('/(auth)/signup');
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.header}>

                <View style={styles.overlayLarge} />
                <View style={styles.overlaySmall} />

                <Text style={styles.headerTitle}>LOG IN</Text>
                <Text style={styles.headerSubtitle}>Login to your existing account</Text>
            </View>

            <View style={styles.content}>

                <SocialSignInButton
                    provider="email"
                    icon={ICONS.GMAIL}
                    onPress={handleEmailLogin}
                />

                <SocialSignInButton
                    provider="phone"
                    icon={ICONS.PHONE}
                    onPress={handlePhoneLogin}
                />

                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>Or sign in with</Text>
                    <View style={styles.dividerLine} />
                </View>

                <SocialSignInButton
                    provider="apple"
                    icon={ICONS.APPLE}
                    onPress={handleAppleLogin}
                    loading={isAppleLoading}
                    disabled={isAppleLoading}
                />

                <SocialSignInButton
                    provider="google"
                    icon={ICONS.GOOGLE}
                    onPress={handleGoogleLogin}
                    loading={isGoogleLoading}
                    disabled={isGoogleLoading}
                />

                <SocialSignInButton
                    provider="facebook"
                    icon={ICONS.FACEBOOK}
                    onPress={handleFacebookLogin}
                    loading={isFacebookLoading}
                    disabled={isFacebookLoading}
                />

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        Don&apos;t have an account?{' '}
                        <Text style={styles.footerLink} onPress={handleSignup}>
                            Sign Up
                        </Text>
                    </Text>
                </View>
            </View>
        </View>
    );
}


