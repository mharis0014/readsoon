import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../constants/Colors';
import ICONS from '../constants/Icons';
import { useHybridUser } from '../context/HybridUserContext';
import { accountStyles } from '../styles/account';

export default function AccountScreen() {
    const { user } = useHybridUser();
    const router = useRouter();

    const accountItems = [
        {
            icon: 'person-outline',
            title: 'Edit Profile',
            subtitle: 'Update your name and photo',
            hasChevron: true,
            onPress: () => console.log('Edit Profile')
        },
        {
            icon: 'mail-outline',
            title: 'Email Address',
            subtitle: user?.email || 'No email set',
            hasChevron: false,
            onPress: () => console.log('Email')
        },
        {
            icon: 'shield-outline',
            title: 'Password',
            subtitle: 'Change your password',
            hasChevron: true,
            onPress: () => console.log('Password')
        },
        {
            icon: 'notifications-outline',
            title: 'Notifications',
            subtitle: 'Manage your notifications',
            hasChevron: true,
            onPress: () => router.push('/notifications')
        },
    ];

    const securityItems = [
        {
            icon: 'lock-closed-outline',
            title: 'Privacy',
            subtitle: 'Manage your privacy settings',
            hasChevron: true,
            onPress: () => console.log('Privacy')
        },
        {
            icon: 'shield-checkmark-outline',
            title: 'Security',
            subtitle: 'Two-factor authentication',
            hasChevron: true,
            onPress: () => console.log('Security')
        },
    ];

    const handleBack = () => router.back();

    return (
        <View style={accountStyles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={accountStyles.header}>
                <TouchableOpacity onPress={handleBack} style={accountStyles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.white} />
                </TouchableOpacity>
                <Text style={accountStyles.headerTitle}>Account</Text>
                <View style={accountStyles.headerSpacer} />
            </View>

            <ScrollView
                style={accountStyles.scrollView}
                contentContainerStyle={accountStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* User Profile Card */}
                {user && (
                    <View style={accountStyles.profileCard}>
                        <Image
                            source={user.avatarUrl ? { uri: user.avatarUrl } : ICONS.PERSON}
                            style={accountStyles.profileAvatar}
                        />
                        <View style={accountStyles.profileInfo}>
                            <Text style={accountStyles.profileName}>
                                {user.fullName || user.username || 'User'}
                            </Text>
                            <Text style={accountStyles.profileEmail}>{user.email}</Text>
                            <View style={accountStyles.profileBadge}>
                                <Text style={accountStyles.profileBadgeText}>
                                    Email Account
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Account Settings */}
                <View style={accountStyles.section}>
                    <Text style={accountStyles.sectionTitle}>Account Settings</Text>
                    {accountItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={accountStyles.settingItem}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={accountStyles.settingContent}>
                                <View style={accountStyles.settingIcon}>
                                    <Ionicons name={item.icon as any} size={20} color={Colors.red} />
                                </View>
                                <View style={accountStyles.settingText}>
                                    <Text style={accountStyles.settingTitle}>{item.title}</Text>
                                    <Text style={accountStyles.settingSubtitle}>{item.subtitle}</Text>
                                </View>
                            </View>
                            {item.hasChevron && (
                                <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Security Settings */}
                <View style={accountStyles.section}>
                    <Text style={accountStyles.sectionTitle}>Security & Privacy</Text>
                    {securityItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={accountStyles.settingItem}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={accountStyles.settingContent}>
                                <View style={accountStyles.settingIcon}>
                                    <Ionicons name={item.icon as any} size={20} color={Colors.red} />
                                </View>
                                <View style={accountStyles.settingText}>
                                    <Text style={accountStyles.settingTitle}>{item.title}</Text>
                                    <Text style={accountStyles.settingSubtitle}>{item.subtitle}</Text>
                                </View>
                            </View>
                            {item.hasChevron && (
                                <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Danger Zone */}
                <View style={accountStyles.section}>
                    <Text style={accountStyles.sectionTitle}>Danger Zone</Text>
                    <TouchableOpacity
                        style={accountStyles.dangerItem}
                        onPress={() => console.log('Delete Account')}
                        activeOpacity={0.7}
                    >
                        <View style={accountStyles.settingContent}>
                            <View style={accountStyles.dangerIcon}>
                                <Ionicons name="trash-outline" size={20} color={Colors.red} />
                            </View>
                            <View style={accountStyles.settingText}>
                                <Text style={accountStyles.dangerTitle}>Delete Account</Text>
                                <Text style={accountStyles.dangerSubtitle}>Permanently delete your account and data</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
