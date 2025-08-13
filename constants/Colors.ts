export const Colors = {
    // Main brand colors
    red: '#FF474C',
    red2: '#ef4444',
    blue: '#0A7EA4',
    orange: '#FF6B35',
    orange2: '#f97316',
    green: '#4CAF50',
    green2: '#22c55e',
    primary: '#0A7EA4', // Same as blue for consistency

    // Basic colors
    white: '#FFFFFF',
    black: '#000000',

    // Grays
    gray: '#666666',
    gray2: '#6f6f6f',
    lightGray: '#F8F8F8',
    mediumGray: '#C4C4C4',

    // Status colors
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FF9800',

    // Theme colors
    light: {
        background: '#FFFFFF',
        text: '#000000',
        surface: '#F8F8F8',
        border: '#E0E0E0',
    },
    dark: {
        background: '#000000',
        text: '#FFFFFF',
        surface: '#1A1A1A',
        border: '#333333',
    },
} as const;

export default Colors;
