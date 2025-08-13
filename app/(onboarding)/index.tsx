import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '../../components/layout/ThemedText';
import { OnboardingSlide } from '../../components/onboarding/OnboardingSlide';
import { PaginationDots } from '../../components/onboarding/PaginationDots';
import { onboardingSlides } from '../../data/onboarding';
import { useOnboarding } from '../../hooks/useOnboarding';
import { onboardingStyles } from '../../styles/onboarding';

export default function OnboardingScreen() {
    const { currentPage, scrollViewRef, handleScroll, goToNextPage, handleSkip } = useOnboarding(onboardingSlides.length);
    const insets = useSafeAreaInsets();

    return (
        <View style={[onboardingStyles.container, { paddingTop: insets.top }]}>
            <StatusBar style="dark" />

            {/* Header with Logo */}
            <View style={onboardingStyles.header}>
                <View />
                <ThemedText style={onboardingStyles.logo}>
                    READSOON
                </ThemedText>
                <View />
            </View>

            {/* Main Content Area */}
            <View style={onboardingStyles.content}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ width: `${onboardingSlides.length * 100}%` }}
                >
                    {onboardingSlides.map((item: any) => (
                        <OnboardingSlide
                            key={item.id}
                            item={item}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Bottom Section */}
            <View style={[onboardingStyles.bottomSection, { paddingBottom: insets.bottom + 20 }]}>
                {/* Pagination Dots */}
                <View style={onboardingStyles.paginationContainer}>
                    <PaginationDots
                        totalPages={onboardingSlides.length}
                        currentPage={currentPage}
                    />
                </View>

                {/* Navigation Buttons */}
                <View style={onboardingStyles.navigationContainer}>
                    <TouchableOpacity
                        style={onboardingStyles.skipButton}
                        onPress={handleSkip}
                        activeOpacity={0.7}
                    >
                        <ThemedText style={onboardingStyles.skipText}>
                            Skip
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={onboardingStyles.nextButton}
                        onPress={goToNextPage}
                        activeOpacity={0.8}
                    >
                        <ThemedText style={onboardingStyles.nextText}>
                            {currentPage === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
} 