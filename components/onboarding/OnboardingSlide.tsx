import React from 'react';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { onboardingStyles } from '../../styles/onboarding';
import { ThemedText } from '../layout/ThemedText';

interface OnboardingSlideProps {
    item: {
        id: number;
        title: string;
        subtitle: string;
        image: any;
    };
}

export function OnboardingSlide({ item }: OnboardingSlideProps) {
    const getIllustration = () => {
        switch (item.id) {
            case 1:
                return require('../../assets/illustrations/1.png');
            case 2:
                return require('../../assets/illustrations/2.png');
            case 3:
                return require('../../assets/illustrations/3.png');
            default:
                return require('../../assets/illustrations/1.png');
        }
    };

    return (
        <View style={onboardingStyles.slideContainer}>
            {/* Illustration */}
            <View style={onboardingStyles.illustrationContainer}>
                <Image
                    source={getIllustration()}
                    style={onboardingStyles.illustration}
                />
            </View>

            {/* Title */}
            <ThemedText style={onboardingStyles.slideTitle}>
                {item.title}
            </ThemedText>

            {/* Description */}
            <ThemedText style={onboardingStyles.slideDescription}>
                {item.subtitle}
            </ThemedText>
        </View>
    );
} 