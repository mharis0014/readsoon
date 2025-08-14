import { useFonts } from 'expo-font';
import { Redirect, Stack, useSegments } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import 'react-native-reanimated';

import { ArticleProvider } from '../context/ArticleContext';
import { ArticleImageProvider } from '../context/ArticleImageContext';
import { HybridUserProvider, useHybridUser } from '../context/HybridUserContext';
import { ThemeProvider as AppThemeProvider } from '../context/ThemeContext';
import { TopPicksProvider } from '../context/TopPicksContext';
import { TTSProvider } from '../context/TTSContext';
import { withPersistedQueryClient } from '../lib/queryClient';

function LoadingScreen() {
  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      zIndex: 9999
    }}>
      <ActivityIndicator size="large" color="#FF474C" />
      <Text style={{
        color: '#FF474C',
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
      }}>
        Checking authentication...
      </Text>
      <Text style={{
        color: '#666666',
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 40
      }}>
        Please wait while we verify your account
      </Text>
    </View>
  );
}

function AuthCheck() {
  const { user, isLoading } = useHybridUser();
  const segments = useSegments();

  const inAuthGroup = segments[0] === '(auth)';
  const isWelcomeScreen = segments[0] === 'welcome';
  const inTabsGroup = segments[0] === '(tabs)';
  const inOnboardingGroup = segments[0] === '(onboarding)';
  const isArticleDetail = segments[0] === 'article-detail';
  const isTextToSpeech = segments[0] === 'text-to-speech';

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If user is authenticated and trying to access auth screens, redirect to home
  if (user) {
    if (inAuthGroup || isWelcomeScreen || inOnboardingGroup) {
      return <Redirect href="/(tabs)" />;
    }
    return null;
  }

  // If user is not authenticated and trying to access protected screens, redirect to welcome
  if (!user && !isLoading) {
    if (inTabsGroup || isArticleDetail || isTextToSpeech) {
      return <Redirect href="/welcome" />;
    }
    return null;
  }

  // Show loading screen during initial app load
  return <LoadingScreen />;
}

function AppContent() {
  const { user, isLoading } = useHybridUser();

  // Show loading screen during initial authentication check
  if (isLoading || user === undefined) {
    return <LoadingScreen />;
  }

  // If user is authenticated, only show authenticated screens
  if (user) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="article-detail" options={{ headerShown: false }} />
        <Stack.Screen name="text-to-speech" options={{ headerShown: false }} />
      </Stack>
    );
  }

  // If user is not authenticated, show unauthenticated screens
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
      }}>
        <ActivityIndicator size="large" color="#FF474C" />
        <Text style={{
          color: '#FF474C',
          marginTop: 16,
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center'
        }}>
          Loading app...
        </Text>
      </View>
    );
  }

  return withPersistedQueryClient({
    children: (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <HybridUserProvider>
          <AppThemeProvider>
            <ArticleProvider>
              <ArticleImageProvider>
                <TopPicksProvider>
                  <TTSProvider>
                    <AuthCheck />
                    <AppContent />
                  </TTSProvider>
                </TopPicksProvider>
              </ArticleImageProvider>
            </ArticleProvider>
          </AppThemeProvider>
        </HybridUserProvider>
      </View>
    )
  });
}
