import React from 'react';
import { Image } from 'expo-image';
import { Text, TouchableOpacity, View } from 'react-native';

import ICONS from '../../constants/Icons';
import { queueStyles as styles } from '../../styles/queue';

interface GettingStartedCardProps {
    onClose: () => void;
    onSetupMobile: () => void;
    onSetupDesktop: () => void;
}

export default function GettingStartedCard({
    onClose,
    onSetupMobile,
    onSetupDesktop,
}: GettingStartedCardProps) {
    return (
        <View style={styles.gettingStartedCard}>
            {/* Header */}
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.cardTitle}>Getting Started</Text>
                    <Text style={styles.cardSubtitle}>Setup your reading workflow.</Text>
                </View>
                <TouchableOpacity onPress={onClose}>
                    <Image source={ICONS.CLOSE_LIGHT} style={styles.closeIcon} />
                </TouchableOpacity>
            </View>

            {/* Mobile Reading Option */}
            <View style={styles.optionCard}>
                <View style={styles.optionContent}>
                    <View style={styles.optionIconContainer}>
                        <Image source={ICONS.MOBILE} style={styles.optionIcon} />
                    </View>
                    <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>Mobile Reading</Text>
                        <Text style={styles.optionDescription}>Save articles on the go</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.setupButton} onPress={onSetupMobile}>
                    <Text style={styles.setupButtonText}>Set Up</Text>
                </TouchableOpacity>
            </View>

            {/* Desktop Reading Option */}
            <View style={styles.optionCard}>
                <View style={styles.optionContent}>
                    <View style={styles.optionIconContainer}>
                        <Image source={ICONS.DESKTOP} style={styles.optionIcon} />
                    </View>
                    <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>Desktop Reading</Text>
                        <Text style={styles.optionDescription}>Save articles on the go</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.setupButton} onPress={onSetupDesktop}>
                    <Text style={styles.setupButtonText}>Set Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
} 