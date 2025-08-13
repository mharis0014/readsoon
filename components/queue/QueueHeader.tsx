import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image } from 'expo-image';
import { Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../../constants/Colors';
import ICONS from '../../constants/Icons';
import { queueStyles as styles } from '../../styles/queue';
import { typography } from '../../utils/responsive';

interface QueueHeaderProps {
    onAddDropdownToggle: () => void;
    onOptionsDropdownToggle: () => void;
    onQueueDropdownToggle: () => void;
}

export default function QueueHeader({
    onAddDropdownToggle,
    onOptionsDropdownToggle,
    onQueueDropdownToggle,
}: QueueHeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <View style={styles.headerLeft} />

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onQueueDropdownToggle}
                    style={styles.titleContainer}
                >
                    <Text style={styles.title}>Queue</Text>
                    <Ionicons name="chevron-down-outline" size={typography.xl} color={Colors.white} />
                </TouchableOpacity>

                <View style={styles.headerActions}>
                    <TouchableOpacity activeOpacity={0.7} onPress={onAddDropdownToggle}>
                        <Image source={ICONS.PLUS} style={styles.headerIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={onOptionsDropdownToggle}>
                        <Image source={ICONS.DOTS_THREE_CIRCLE} style={styles.headerIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
} 