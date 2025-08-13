import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../../constants/Colors';
import ICONS from '../../constants/Icons';
import { useHybridUser } from '../../context/HybridUserContext';
import { profileStyles } from '../../styles/profile';
import { typography } from '../../utils/responsive';

export default function ProfileScreen() {
    const { logout, user } = useHybridUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const settingsItems = [
        { icon: ICONS.PERSON, title: 'Account', hasChevron: true, bgColor: '#EDFAFF' },
        { icon: ICONS.STAR, title: 'Subscription', hasChevron: true, bgColor: '#FFFADF' },
        { icon: ICONS.ELLIPSE, title: 'Reading Options', hasChevron: true, bgColor: '#E8FFEB' },
        { icon: ICONS.STARS, title: 'Appearance', hasChevron: true, bgColor: '#E3F7F5' },
        { icon: ICONS.HEADPHONES, title: 'Audio', hasChevron: true, bgColor: '#FFF3FC' },
        { icon: ICONS.NOTIFICATIONS, title: 'Notifications', hasChevron: true, bgColor: '#FFF0F0' },
    ];

    const connectItems = [
        { icon: ICONS.CHAT_BOX, title: 'Send Feedback', hasChevron: false, bgColor: '#ECFFED' },
        { icon: ICONS.HEART, title: 'Help Us Grow', hasChevron: false, bgColor: '#E5FFFC' },
        { icon: ICONS.PERSON_ADD, title: 'Invite', hasChevron: false, bgColor: '#F5F3FF' },
    ];

    const handleItemPress = (title: string) => {
        switch (title) {
            case 'Account':
                router.push('/account');
                break;
            case 'Subscription':
                router.push('/subscription');
                break;
            case 'Notifications':
                router.push('/notifications');
                break;
            case 'Audio':
                router.push('/audio');
                break;
            case 'Reading Options':
                router.push('/reading-options');
                break;
            default:
                console.log(`Pressed: ${title}`);
                // Add navigation logic for other items here
                break;
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        await logout();
        setIsLoading(false);
    };

    return (
        <View style={profileStyles.container}>
            <StatusBar style="light" />

            {/* Red Header */}
            <View style={profileStyles.header}>
                <Text style={profileStyles.headerTitle}>Settings</Text>
                <Text style={profileStyles.headerSubtitle}>Manage your preferences</Text>
            </View>

            <ScrollView
                style={profileStyles.scrollView}
                contentContainerStyle={profileStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* User Profile Section */}
                {user && (
                    <View style={profileStyles.userSection}>
                        <View style={profileStyles.userProfile}>
                            <Image
                                source={user.avatarUrl ? { uri: user.avatarUrl } : ICONS.PERSON}
                                style={profileStyles.userAvatar}
                            />
                            <View style={profileStyles.userInfo}>
                                <Text style={profileStyles.userName}>
                                    {user.fullName || user.username || 'User'}
                                </Text>
                                <Text style={profileStyles.userEmail}>{user.email}</Text>
                                <Text style={profileStyles.userProvider}>
                                    Email Account
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Settings Section */}
                <View style={profileStyles.section}>
                    <View style={profileStyles.sectionHeader}>
                        <Text style={profileStyles.sectionTitle}>Settings</Text>
                    </View>

                    {settingsItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={profileStyles.settingItem}
                            onPress={() => handleItemPress(item.title)}
                            activeOpacity={0.7}
                        >
                            <View style={profileStyles.settingItemContent}>
                                <View style={[profileStyles.iconContainer, { backgroundColor: item.bgColor }]}>
                                    <Image source={item.icon} style={profileStyles.settingIcon} />
                                </View>
                                <Text style={profileStyles.settingText}>{item.title}</Text>
                            </View>
                            {item.hasChevron && (
                                <Ionicons name="chevron-forward" size={typography.md} color={Colors.mediumGray} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Connect with us Section */}
                <View style={profileStyles.section}>
                    <View style={profileStyles.sectionHeader}>
                        <Text style={profileStyles.sectionTitle}>Connect with us</Text>
                    </View>

                    {connectItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={profileStyles.settingItem}
                            onPress={() => handleItemPress(item.title)}
                            activeOpacity={0.7}
                        >
                            <View style={profileStyles.settingItemContent}>
                                <View style={[profileStyles.iconContainer, { backgroundColor: item.bgColor }]}>
                                    <Image source={item.icon} style={profileStyles.settingIcon} />
                                </View>
                                <Text style={profileStyles.settingText}>{item.title}</Text>
                            </View>
                            {item.hasChevron && (
                                <Ionicons name="chevron-forward" size={typography.md} color={Colors.mediumGray} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={profileStyles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    {isLoading
                        ? <ActivityIndicator size="small" color={Colors.white} />
                        : <Text style={profileStyles.logoutText}>Logout</Text>
                    }
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
