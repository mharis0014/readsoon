import { StyleSheet } from 'react-native';

export const onboardingStyles = StyleSheet.create({
    // Container styles
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    // Header styles
    header: {
        paddingTop: 60,
        paddingHorizontal: 32,
        paddingBottom: 24,
    },

    // Content styles
    content: {
        flex: 1,
        paddingHorizontal: 32,
    },

    // Bottom section styles
    bottomSection: {
        paddingHorizontal: 32,
        paddingBottom: 40,
    },

    // Logo styles
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF474C',
        alignSelf: 'center',
    },

    // Navigation styles
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 32,
    },

    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 32,
    },

    // Button styles
    skipButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minHeight: 44,
    },

    nextButton: {
        backgroundColor: '#FF474C',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        minHeight: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Button text styles
    skipText: {
        fontSize: 16,
        color: '#666666',
        fontWeight: '500',
    },

    nextText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },

    // OnboardingSlide styles
    slideContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },

    illustrationContainer: {
        marginBottom: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },

    illustration: {
        width: 380,
        height: 200,
        resizeMode: 'contain',
    },

    slideTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 36,
    },

    slideDescription: {
        fontSize: 14,
        color: '#2D2B2E',
        textAlign: 'center',
        lineHeight: 24,
        opacity: 0.8,
    },

    // PaginationDots styles
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
    },

    paginationDotActive: {
        width: 24,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF474C',
    },
}); 