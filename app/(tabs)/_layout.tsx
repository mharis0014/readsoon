import { Tabs } from 'expo-router';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';
import ICONS from '../../constants/Icons';
import { spacing, typography } from '../../utils/responsive';

const TAB_HEIGHT = (spacing.xl * 2) + spacing.sm; // 64px

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: Colors.red,
        tabBarInactiveTintColor: Colors.mediumGray,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Image source={focused ? ICONS.HOME_ACTIVE : ICONS.HOME} style={styles.tabBarIcon} />
          ),
        }}
      />
      <Tabs.Screen
        name="queue"
        options={{
          title: 'Queue',
          tabBarIcon: ({ color, focused }) => (
            <Image source={focused ? ICONS.QUEUE_ACTIVE : ICONS.QUEUE} style={styles.tabBarIcon} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Image source={focused ? ICONS.PROFILE_ACTIVE : ICONS.PROFILE} style={styles.tabBarIcon} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: TAB_HEIGHT,
    position: 'absolute',
    paddingVertical: spacing.sm,
  },
  tabBarLabel: {
    fontSize: typography.xs,
    marginVertical: spacing.xs,
  },
  tabBarIcon: {
    width: spacing.lg,
    height: spacing.lg,
  },
});
