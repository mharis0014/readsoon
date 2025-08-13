import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../constants/Colors';
import { notificationStyles } from '../styles/notification';

export default function NotificationsScreen() {
    const router = useRouter();
    const [pushNotifications, setPushNotifications] = useState(true);
    const [newPostsFromWriters, setNewPostsFromWriters] = useState(false);

    const handleBackPress = () => {
        router.back();
    };

    const handlePushNotificationsToggle = (value: boolean) => {
        setPushNotifications(value);
        // TODO: Implement push notifications logic
        console.log('Push notifications:', value);
    };

    const handleNewPostsToggle = (value: boolean) => {
        setNewPostsFromWriters(value);
        // TODO: Implement new posts notifications logic
        console.log('New posts from writers:', value);
    };

    return (
        <View style={notificationStyles.container}>
            <StatusBar style="light" />

            {/* Red Header */}
            <View style={notificationStyles.header}>
                <TouchableOpacity
                    style={notificationStyles.backButton}
                    onPress={handleBackPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={24} color={Colors.white} />
                </TouchableOpacity>

                <Text style={notificationStyles.headerTitle}>Notifications</Text>

                {/* Empty view for centering */}
                <View style={notificationStyles.placeholder} />
            </View>

            {/* Main Content */}
            <View style={notificationStyles.content}>
                {/* Push Notifications */}
                <View style={notificationStyles.settingItem}>
                    <Text style={notificationStyles.settingText}>Push Notifications</Text>
                    <Switch
                        value={pushNotifications}
                        onValueChange={handlePushNotificationsToggle}
                        trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                        thumbColor={pushNotifications ? '#FFFFFF' : '#FFFFFF'}
                        ios_backgroundColor="#E0E0E0"
                    />
                </View>

                {/* Divider */}
                <View style={notificationStyles.divider} />

                {/* New post from writers */}
                <View style={notificationStyles.settingItem}>
                    <Text style={notificationStyles.settingText}>New post from writers</Text>
                    <Switch
                        value={newPostsFromWriters}
                        onValueChange={handleNewPostsToggle}
                        trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                        thumbColor={newPostsFromWriters ? '#FFFFFF' : '#FFFFFF'}
                        ios_backgroundColor="#E0E0E0"
                    />
                </View>
            </View>
        </View>
    );
} 