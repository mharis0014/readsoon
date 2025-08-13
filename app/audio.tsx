import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../constants/Colors';
import { audioStyles } from '../styles/audio';

export default function AudioScreen() {
    const router = useRouter();
    const [autoplay, setAutoplay] = useState(true);

    const handleBackPress = () => {
        router.back();
    };

    const handleVoicePress = () => {
        // TODO: Navigate to voice selection screen
        console.log('Voice pressed');
    };

    const handleSpeedPress = () => {
        // TODO: Navigate to speed selection screen
        console.log('Speed pressed');
    };

    const handleDoubleSqueezePress = () => {
        // TODO: Navigate to double squeeze action selection
        console.log('Double squeeze pressed');
    };

    const handleTripleSqueezePress = () => {
        // TODO: Navigate to triple squeeze action selection
        console.log('Triple squeeze pressed');
    };

    const handleAutoplayToggle = (value: boolean) => {
        setAutoplay(value);
        // TODO: Implement autoplay logic
        console.log('Autoplay:', value);
    };

    return (
        <View style={audioStyles.container}>
            <StatusBar style="light" />

            {/* Red Header */}
            <View style={audioStyles.header}>
                <TouchableOpacity
                    style={audioStyles.backButton}
                    onPress={handleBackPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={24} color={Colors.white} />
                </TouchableOpacity>

                <Text style={audioStyles.headerTitle}>Audio</Text>

                {/* Empty view for centering */}
                <View style={audioStyles.placeholder} />
            </View>

            {/* Main Content */}
            <View style={audioStyles.content}>
                {/* Text to speech Section */}
                <View style={audioStyles.section}>
                    <View style={audioStyles.sectionHeader}>
                        <Text style={audioStyles.sectionTitle}>Text to speech</Text>
                    </View>

                    <TouchableOpacity
                        style={audioStyles.settingItem}
                        onPress={handleVoicePress}
                        activeOpacity={0.7}
                    >
                        <Text style={audioStyles.settingText}>Voice</Text>
                        <View style={audioStyles.settingValue}>
                            <Text style={audioStyles.valueText}>Lauren</Text>
                            <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={audioStyles.settingItem}
                        onPress={handleSpeedPress}
                        activeOpacity={0.7}
                    >
                        <Text style={audioStyles.settingText}>Speed</Text>
                        <View style={audioStyles.settingValue}>
                            <Text style={audioStyles.valueText}>1.0x</Text>
                            <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Headphone gestures Section */}
                <View style={audioStyles.section}>
                    <View style={audioStyles.sectionHeader}>
                        <Text style={audioStyles.sectionTitle}>Headphone gestures</Text>
                    </View>

                    <TouchableOpacity
                        style={audioStyles.settingItem}
                        onPress={handleDoubleSqueezePress}
                        activeOpacity={0.7}
                    >
                        <Text style={audioStyles.settingText}>Double Squeeze</Text>
                        <View style={audioStyles.settingValue}>
                            <Text style={audioStyles.valueText}>Highlight text</Text>
                            <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={audioStyles.settingItem}
                        onPress={handleTripleSqueezePress}
                        activeOpacity={0.7}
                    >
                        <Text style={audioStyles.settingText}>Triple Squeeze</Text>
                        <View style={audioStyles.settingValue}>
                            <Text style={audioStyles.valueText}>Jump back</Text>
                            <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Advanced settings Section */}
                <View style={audioStyles.section}>
                    <View style={audioStyles.sectionHeader}>
                        <Text style={audioStyles.sectionTitle}>Advanced settings</Text>
                    </View>

                    <View style={audioStyles.settingItem}>
                        <Text style={audioStyles.settingText}>Autoplay</Text>
                        <Switch
                            value={autoplay}
                            onValueChange={handleAutoplayToggle}
                            trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                            thumbColor={autoplay ? '#FFFFFF' : '#FFFFFF'}
                            ios_backgroundColor="#E0E0E0"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
} 