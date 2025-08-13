import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../constants/Colors';
import { subscriptionStyles } from '../styles/subscription';

export default function SubscriptionScreen() {
    const router = useRouter();

    const handleBackPress = () => {
        router.back();
    };

    const handleGoPremium = () => {
        // TODO: Implement premium subscription logic
        console.log('Go Premium pressed');
    };

    return (
        <View style={subscriptionStyles.container}>
            <StatusBar style="light" />

            {/* Red Header */}
            <View style={subscriptionStyles.header}>
                <TouchableOpacity
                    style={subscriptionStyles.backButton}
                    onPress={handleBackPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={24} color={Colors.white} />
                </TouchableOpacity>

                <Text style={subscriptionStyles.headerTitle}>Subscription</Text>

                {/* Empty view for centering */}
                <View style={subscriptionStyles.placeholder} />
            </View>

            {/* Main Content */}
            <View style={subscriptionStyles.content}>
                <Text style={subscriptionStyles.statusText}>Not Subscribed</Text>

                <TouchableOpacity
                    style={subscriptionStyles.premiumButton}
                    onPress={handleGoPremium}
                    activeOpacity={0.7}
                >
                    <Text style={subscriptionStyles.premiumText}>Go Premium</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
} 