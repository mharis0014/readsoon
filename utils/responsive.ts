import { Dimensions, PixelRatio, Platform } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline sizes (based on iPhone 14 Pro: 393 x 852)
const guidelineBaseWidth = 393;
const guidelineBaseHeight = 852;

// Scale based on width
export const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

// Scale based on height
export const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

// Moderate scale (useful for font sizes)
export const moderateScale = (size: number, factor = 0.5) =>
    size + (scale(size) - size) * factor;

// Font scaling with PixelRatio
export const fontScale = (size: number) =>
    Math.round(PixelRatio.roundToNearestPixel(moderateScale(size)));

// Responsive spacing units
export const spacing = {
    xs: scale(4),
    sm: scale(8),
    smd: scale(12),
    md: scale(16),
    mdd: scale(20),
    lg: scale(24),
    xl: scale(32),
    xxl: scale(40),
    xxxl: scale(48),
    xxxxl: scale(56),
    xxxxxl: scale(64),
};

// Typography system
export const typography = {
    xs: fontScale(12),
    sm: fontScale(14),
    md: fontScale(16),
    lg: fontScale(18),
    xl: fontScale(22),
    xxl: fontScale(24),
    xxxl: fontScale(28),
    xxxxl: fontScale(32),
    display: fontScale(36),
};

// Device breakpoints
export const device = {
    isSmallPhone: SCREEN_WIDTH < 360,
    isTablet: SCREEN_WIDTH >= 768,
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
};

// Screen dimensions
export const screen = {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,

};

// Platform checks
export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';
export const TAB_BAR_HEIGHT = (spacing.xl * 2) + spacing.sm;

// Responsive hook
export const useResponsive = () => {
    return {
        screen,
        device,
        scale,
        verticalScale,
        moderateScale,
        fontScale,
        spacing,
        typography,
        isAndroid,
        isIOS,
        TAB_BAR_HEIGHT,
    };
};
