import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { spacing } from '@/utils/responsive';
import { Colors } from '../../constants/Colors';
import { authStyles } from '../../styles/auth';
import { ThemedText } from './ThemedText';

interface AuthHeaderProps {
    title: string;
    subtitle: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
    title,
    subtitle,
    showBackButton = false,
    onBackPress,
}) => {
    return (
        <View style={authStyles.header}>
            <View style={authStyles.overlayLarge} />
            <View style={authStyles.overlaySmall} />

            {showBackButton && onBackPress && (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBackPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={Colors.white} />
                </TouchableOpacity>
            )}

            <View style={[
                styles.headerContent,
                showBackButton && styles.headerContentWithBack
            ]}>
                <ThemedText style={authStyles.headerTitle}>
                    {title}
                </ThemedText>
                <ThemedText style={authStyles.headerSubtitle}>
                    {subtitle}
                </ThemedText>
            </View>
        </View>
    );
};

const styles = {
    backButton: {
        position: 'absolute' as const,
        top: 60,
        left: spacing.lg,
        zIndex: 10,
        padding: spacing.sm,
    },
    headerContent: {
        alignItems: 'center' as const,
    },
    headerContentWithBack: {
        alignItems: 'center' as const,
    },
};
