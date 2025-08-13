import type { ReaderTheme } from '@/utils/articleContentHelpers';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { getReaderThemeColors, articleDetailStyles as styles } from '../../styles/article-detail';

interface ReadingModeHeaderProps {
    title?: string;
    readerTheme: ReaderTheme;
    fontSizePx: number;
    onChangeTheme?: (t: ReaderTheme) => void;
    onChangeFontSize?: (px: number) => void;
}

export default function ReadingModeHeader({
    title,
    readerTheme,
    fontSizePx,
    onChangeTheme,
    onChangeFontSize,
}: ReadingModeHeaderProps) {
    const themeColors = getReaderThemeColors(readerTheme);
    
    return (
        <View style={[
            styles.readingModeHeader,
            { 
                backgroundColor: themeColors.headerBackground,
                borderBottomColor: themeColors.borderColor
            }
        ]}>
            {/* Reader Controls Toolbar */}
            <View style={[
                styles.readerControlsToolbar,
                { 
                    backgroundColor: themeColors.backgroundColor === '#ffffff' ? '#f8fafc' : themeColors.backgroundColor,
                    borderColor: themeColors.borderColor
                }
            ]}>
                {/* Theme Controls */}
                <View style={styles.themeControls}>
                    {(['light', 'sepia', 'dark'] as ReaderTheme[]).map(t => {
                        const isActive = readerTheme === t;
                        const buttonThemeColors = getReaderThemeColors(t);
                        
                        return (
                            <TouchableOpacity
                                key={t}
                                onPress={() => onChangeTheme?.(t)}
                                style={[
                                    styles.themeButton,
                                    isActive ? {
                                        backgroundColor: buttonThemeColors.highlightButtonBackground,
                                        borderColor: buttonThemeColors.highlightButtonBackground,
                                        shadowColor: buttonThemeColors.highlightButtonBackground,
                                        shadowOpacity: 0.2,
                                        elevation: 2,
                                    } : styles.themeButtonInactive
                                ]}
                            >
                                <Text style={[
                                    styles.themeButtonText,
                                    isActive ? {
                                        color: buttonThemeColors.highlightButtonText
                                    } : styles.themeButtonTextInactive
                                ]}>
                                    {t}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Font Size Controls */}
                <View style={[
                    styles.fontSizeControls,
                    { 
                        backgroundColor: themeColors.backgroundColor,
                        borderColor: themeColors.borderColor
                    }
                ]}>
                    <TouchableOpacity
                        onPress={() => onChangeFontSize?.(Math.max(12, fontSizePx - 2))}
                        style={[
                            styles.fontSizeButton,
                            { backgroundColor: themeColors.backgroundColor === '#ffffff' ? '#f9fafb' : themeColors.backgroundColor }
                        ]}
                        disabled={fontSizePx <= 12}
                    >
                        <Text style={[
                            styles.fontSizeButtonText,
                            fontSizePx <= 12 ? { color: themeColors.mutedColor } : { color: themeColors.textColor }
                        ]}>−</Text>
                    </TouchableOpacity>
                    <Text style={[
                        styles.fontSizeText,
                        { color: themeColors.textColor }
                    ]}>{fontSizePx}px</Text>
                    <TouchableOpacity
                        onPress={() => onChangeFontSize?.(Math.min(32, fontSizePx + 2))}
                        style={[
                            styles.fontSizeButton,
                            { backgroundColor: themeColors.backgroundColor === '#ffffff' ? '#f9fafb' : themeColors.backgroundColor }
                        ]}
                        disabled={fontSizePx >= 32}
                    >
                        <Text style={[
                            styles.fontSizeButtonText,
                            fontSizePx >= 32 ? { color: themeColors.mutedColor } : { color: themeColors.textColor }
                        ]}>+</Text>
                    </TouchableOpacity>
                </View>

            </View>
            {/* Reading Hint */}
            <View style={[
                styles.readingHint,
                { 
                    backgroundColor: themeColors.backgroundColor === '#ffffff' ? '#fef3c7' : themeColors.backgroundColor,
                    borderColor: themeColors.backgroundColor === '#ffffff' ? '#fde68a' : themeColors.borderColor
                }
            ]}>
                <Text style={[
                    styles.readingHintText,
                    { color: themeColors.backgroundColor === '#ffffff' ? '#92400e' : themeColors.textColor }
                ]}>Note: Long-press to select text for highlighting.</Text>
            </View>
        </View>
    );
}
