import React from 'react';
import { View } from 'react-native';

import { onboardingStyles } from '../../styles/onboarding';

interface PaginationDotsProps {
    totalPages: number;
    currentPage: number;
}

export function PaginationDots({ totalPages, currentPage }: PaginationDotsProps) {
    return (
        <View style={onboardingStyles.paginationContainer}>
            {Array.from({ length: totalPages }, (_, index) => (
                <View
                    key={index}
                    style={
                        index === currentPage
                            ? onboardingStyles.paginationDotActive
                            : onboardingStyles.paginationDot
                    }
                />
            ))}
        </View>
    );
} 