import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';

export function useOnboarding(totalPages: number) {
    const [currentPage, setCurrentPage] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const screenWidth = Dimensions.get('window').width;

    const handleScroll = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset;
        const page = Math.round(contentOffset.x / event.nativeEvent.layoutMeasurement.width);
        setCurrentPage(page);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            const nextPage = currentPage + 1;
            // Don't manually update state - let the scroll event handle it
            scrollViewRef.current?.scrollTo({
                x: nextPage * screenWidth,
                animated: true,
            });
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = () => {
        router.replace('/(tabs)');
    };

    return {
        currentPage,
        scrollViewRef,
        handleScroll,
        goToNextPage,
        handleSkip,
    };
} 