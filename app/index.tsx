import { Redirect } from 'expo-router';
import React from 'react';
import { useHybridUser } from '../context/HybridUserContext';

export default function Index() {
    const { user, isLoading } = useHybridUser();

    // Show loading screen while checking authentication
    if (isLoading) {
        return null; // AuthCheck will handle the loading screen
    }

    // If user is authenticated, go to main app
    if (user) {
        return <Redirect href="/(tabs)" />;
    }

    // If user is not authenticated, go to welcome
    return <Redirect href="/welcome" />;
}
