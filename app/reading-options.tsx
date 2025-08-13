import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../constants/Colors';
import { readingOptionsStyles } from '../styles/readingOptions';

export default function ReadingOptionsScreen() {
    const router = useRouter();
    const [selectedGoal, setSelectedGoal] = useState('5 minutes');
    const [showReadingStreak, setShowReadingStreak] = useState(true);

    const handleBackPress = () => {
        router.back();
    };

    const handleGoalPress = (goal: string) => {
        setSelectedGoal(goal);
        // TODO: Save reading goal preference
        console.log('Reading goal set to:', goal);
    };

    const handleShowEstimatePress = () => {
        // TODO: Navigate to estimate display options
        console.log('Show estimate pressed');
    };

    const handleTripleSqueezePress = () => {
        // TODO: Navigate to triple squeeze action selection
        console.log('Triple squeeze pressed');
    };

    const handleReadingStreakToggle = (value: boolean) => {
        setShowReadingStreak(value);
        // TODO: Implement reading streak logic
        console.log('Reading streak:', value);
    };

    const readingGoals = ['2 minutes', '5 minutes', '10 minutes', '15 minutes', 'No goal'];

    return (
        <View style={readingOptionsStyles.container}>
            <StatusBar style="light" />

            {/* Red Header */}
            <View style={readingOptionsStyles.header}>
                <TouchableOpacity
                    style={readingOptionsStyles.backButton}
                    onPress={handleBackPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={24} color={Colors.white} />
                </TouchableOpacity>

                <Text style={readingOptionsStyles.headerTitle}>Reading Options</Text>

                {/* Empty view for centering */}
                <View style={readingOptionsStyles.placeholder} />
            </View>

            {/* Main Content */}
            <View style={readingOptionsStyles.content}>
                {/* Daily reading goal Section */}
                <View style={readingOptionsStyles.section}>
                    <View style={readingOptionsStyles.sectionHeader}>
                        <Text style={readingOptionsStyles.sectionTitle}>Daily reading goal</Text>
                    </View>

                    {readingGoals.map((goal, index) => (
                        <TouchableOpacity
                            key={index}
                            style={readingOptionsStyles.settingItem}
                            onPress={() => handleGoalPress(goal)}
                            activeOpacity={0.7}
                        >
                            <Text style={readingOptionsStyles.settingText}>{goal}</Text>
                            {selectedGoal === goal && (
                                <Ionicons name="checkmark" size={20} color="#4CAF50" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Estimated article length Section */}
                <View style={readingOptionsStyles.section}>
                    <View style={readingOptionsStyles.sectionHeader}>
                        <Text style={readingOptionsStyles.sectionTitle}>Estimated article length</Text>
                    </View>

                    <TouchableOpacity
                        style={readingOptionsStyles.settingItem}
                        onPress={handleShowEstimatePress}
                        activeOpacity={0.7}
                    >
                        <Text style={readingOptionsStyles.settingText}>Show estimate in</Text>
                        <View style={readingOptionsStyles.settingValue}>
                            <Text style={readingOptionsStyles.valueText}>Reading time</Text>
                            <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={readingOptionsStyles.settingItem}
                        onPress={handleTripleSqueezePress}
                        activeOpacity={0.7}
                    >
                        <Text style={readingOptionsStyles.settingText}>Triple Squeeze</Text>
                        <View style={readingOptionsStyles.settingValue}>
                            <Text style={readingOptionsStyles.valueText}>Jump back</Text>
                            <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Reading streak Section */}
                <View style={readingOptionsStyles.section}>
                    <View style={readingOptionsStyles.sectionHeader}>
                        <Text style={readingOptionsStyles.sectionTitle}>Reading streak</Text>
                    </View>

                    <View style={readingOptionsStyles.settingItem}>
                        <Text style={readingOptionsStyles.settingText}>Show reading streak module</Text>
                        <Switch
                            value={showReadingStreak}
                            onValueChange={handleReadingStreakToggle}
                            trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                            thumbColor={showReadingStreak ? '#FFFFFF' : '#FFFFFF'}
                            ios_backgroundColor="#E0E0E0"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
} 