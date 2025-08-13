import React, { createContext, useContext, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

type ThemeCtx = {
    scheme: ColorSchemeName;
    toggleTheme: () => void;
    setTheme: (s: ColorSchemeName) => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

/**
 * Provider component for theme management
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = Appearance.getColorScheme() ?? 'light';
    const [scheme, setScheme] = useState<ColorSchemeName>(systemScheme);

    const value = useMemo(
        () => ({
            scheme,
            toggleTheme: () => setScheme((p) => (p === 'dark' ? 'light' : 'dark')),
            setTheme: setScheme,
        }),
        [scheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Hook to access theme context
 * @returns Theme context with scheme and theme management methods
 */
export const useAppTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useAppTheme must be used inside ThemeProvider');
    return ctx;
}; 