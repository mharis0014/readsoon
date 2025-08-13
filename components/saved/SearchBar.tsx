import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { spacing, typography } from '../../utils/responsive';
import { CustomInput } from '../ui/CustomInput';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear: () => void;
    placeholder?: string;
}

export function SearchBar({
    value,
    onChangeText,
    onClear,
    placeholder = "Search articles..."
}: SearchBarProps) {
    const placeholderColor = useThemeColor({ light: '#999999', dark: '#666666' }, 'text');

    return (
        <View style={styles.container}>
            <CustomInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                leftIcon={<Ionicons name="search-outline" size={20} color={placeholderColor} />}
                isPassword={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0,
        paddingVertical: spacing.sm,
        margin: 0,
    },
    searchInput: {
        fontSize: typography.sm,
        margin: 0,
        padding: 0,
    },
}); 