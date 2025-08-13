import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '../components/layout/ThemedText';
import { CustomButton } from '../components/ui/CustomButton';
import { welcomeStyles } from '../styles/welcome';

export default function WelcomeScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                welcomeStyles.container,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                }
            ]}
        >
            <StatusBar style="light" />

            <View style={welcomeStyles.mainContent}>

                <View style={welcomeStyles.spacer} />

                <View style={welcomeStyles.welcomeTextContainer}>
                    <ThemedText style={welcomeStyles.welcomeTitle}>
                        WELCOME TO READSOON
                    </ThemedText>

                    <ThemedText style={welcomeStyles.welcomeSubtitle}>
                        Track your reading progress, sync{'\n'}
                        across all your devices and many more.
                    </ThemedText>
                </View>

                <View style={welcomeStyles.buttonContainer}>
                    <CustomButton
                        title="SIGN IN"
                        onPress={() => router.push('/(auth)/login-options')}
                        variant="filled"
                        backgroundColor="#FFFFFF"
                        textColor="#FF474C"
                        fullWidth
                    />
                    <CustomButton
                        title="SIGN UP"
                        onPress={() => router.push('/(auth)/signup')}
                        variant="outlined"
                        fullWidth
                    />
                </View>
            </View>
        </View>
    );
}
