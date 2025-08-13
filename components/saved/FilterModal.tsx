import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { typography } from '../../constants/Typography';
import { useThemeColor } from '../../hooks/useThemeColor';
import { spacing } from '../../utils/responsive';
import { CustomButton } from '../ui/CustomButton';
import { CustomInput } from '../ui/CustomInput';

export interface FilterOptions {
    dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
    sources: string[];
    readingTime: 'all' | 'quick' | 'medium' | 'long';
    tags: string[];
    favoritesOnly: boolean;
    hasContent: boolean;
}

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: FilterOptions) => void;
    currentFilters: FilterOptions;
    availableSources: string[];
    availableTags: string[];
}

const DATE_RANGE_OPTIONS = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
];

const READING_TIME_OPTIONS = [
    { value: 'all', label: 'Any Length' },
    { value: 'quick', label: 'Quick Read (< 5 min)' },
    { value: 'medium', label: 'Medium (5-15 min)' },
    { value: 'long', label: 'Long Read (> 15 min)' },
];

export function FilterModal({
    visible,
    onClose,
    onApply,
    currentFilters,
    availableSources,
    availableTags,
}: FilterModalProps) {
    const [filters, setFilters] = useState<FilterOptions>(currentFilters);
    const [customTags, setCustomTags] = useState('');

    const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#1a1a1a' }, 'background');
    const textColor = useThemeColor({ light: '#333333', dark: '#f5f5f5' }, 'text');
    const subtitleColor = useThemeColor({ light: '#666666', dark: '#a0a0a0' }, 'text');
    const accentColor = useThemeColor({ light: '#0a7ea4', dark: '#4fc3f7' }, 'text');
    const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'text');

    const updateFilter = <K extends keyof FilterOptions>(
        key: K,
        value: FilterOptions[K]
    ) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const toggleSource = (source: string) => {
        const newSources = filters.sources.includes(source)
            ? filters.sources.filter(s => s !== source)
            : [...filters.sources, source];
        updateFilter('sources', newSources);
    };

    const toggleTag = (tag: string) => {
        const newTags = filters.tags.includes(tag)
            ? filters.tags.filter(t => t !== tag)
            : [...filters.tags, tag];
        updateFilter('tags', newTags);
    };

    const addCustomTag = () => {
        if (customTags.trim() && !filters.tags.includes(customTags.trim())) {
            updateFilter('tags', [...filters.tags, customTags.trim()]);
            setCustomTags('');
        }
    };

    const removeTag = (tag: string) => {
        updateFilter('tags', filters.tags.filter(t => t !== tag));
    };

    const clearAllFilters = () => {
        setFilters({
            dateRange: 'all',
            sources: [],
            readingTime: 'all',
            tags: [],
            favoritesOnly: false,
            hasContent: false,
        });
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const isFilterActive = () => {
        return (
            filters.dateRange !== 'all' ||
            filters.sources.length > 0 ||
            filters.readingTime !== 'all' ||
            filters.tags.length > 0 ||
            filters.favoritesOnly ||
            filters.hasContent
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: borderColor }]}>
                    <TouchableOpacity onPress={onClose} hitSlop={8}>
                        <Ionicons name="close" size={24} color={textColor} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: textColor }]}>
                        Filter Articles
                    </Text>
                    <TouchableOpacity onPress={clearAllFilters} hitSlop={8}>
                        <Text style={[styles.clearText, { color: accentColor }]}>
                            Clear All
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Date Range */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: textColor }]}>
                            Date Range
                        </Text>
                        <View style={styles.optionsContainer}>
                            {DATE_RANGE_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.optionButton,
                                        filters.dateRange === option.value && {
                                            backgroundColor: accentColor,
                                        },
                                        { borderColor },
                                    ]}
                                    onPress={() => updateFilter('dateRange', option.value as any)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            {
                                                color: filters.dateRange === option.value
                                                    ? '#ffffff'
                                                    : textColor,
                                            },
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Sources */}
                    {availableSources.length > 0 && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: textColor }]}>
                                Sources
                            </Text>
                            <View style={styles.optionsContainer}>
                                {availableSources.map((source) => (
                                    <TouchableOpacity
                                        key={source}
                                        style={[
                                            styles.optionButton,
                                            filters.sources.includes(source) && {
                                                backgroundColor: accentColor,
                                            },
                                            { borderColor },
                                        ]}
                                        onPress={() => toggleSource(source)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                {
                                                    color: filters.sources.includes(source)
                                                        ? '#ffffff'
                                                        : textColor,
                                                },
                                            ]}
                                        >
                                            {source}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Reading Time */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: textColor }]}>
                            Reading Time
                        </Text>
                        <View style={styles.optionsContainer}>
                            {READING_TIME_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.optionButton,
                                        filters.readingTime === option.value && {
                                            backgroundColor: accentColor,
                                        },
                                        { borderColor },
                                    ]}
                                    onPress={() => updateFilter('readingTime', option.value as any)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            {
                                                color: filters.readingTime === option.value
                                                    ? '#ffffff'
                                                    : textColor,
                                            },
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Tags */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: textColor }]}>
                            Tags
                        </Text>

                        {/* Custom tag input */}
                        <View style={styles.tagInputContainer}>
                            <CustomInput
                                placeholder="Add custom tag..."
                                value={customTags}
                                onChangeText={setCustomTags}
                                style={styles.tagInput}
                            />
                            <TouchableOpacity
                                style={[styles.addTagButton, { backgroundColor: accentColor }]}
                                onPress={addCustomTag}
                                disabled={!customTags.trim()}
                            >
                                <Ionicons name="add" size={20} color="#ffffff" />
                            </TouchableOpacity>
                        </View>

                        {/* Available tags */}
                        {availableTags.length > 0 && (
                            <View style={styles.optionsContainer}>
                                {availableTags.map((tag) => (
                                    <TouchableOpacity
                                        key={tag}
                                        style={[
                                            styles.optionButton,
                                            filters.tags.includes(tag) && {
                                                backgroundColor: accentColor,
                                            },
                                            { borderColor },
                                        ]}
                                        onPress={() => toggleTag(tag)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                {
                                                    color: filters.tags.includes(tag)
                                                        ? '#ffffff'
                                                        : textColor,
                                                },
                                            ]}
                                        >
                                            #{tag}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Selected tags */}
                        {filters.tags.length > 0 && (
                            <View style={styles.selectedTagsContainer}>
                                <Text style={[styles.selectedTagsTitle, { color: subtitleColor }]}>
                                    Selected Tags:
                                </Text>
                                <View style={styles.selectedTagsList}>
                                    {filters.tags.map((tag) => (
                                        <View
                                            key={tag}
                                            style={[styles.selectedTag, { backgroundColor: accentColor }]}
                                        >
                                            <Text style={[styles.selectedTagText, { color: '#ffffff' }]}>
                                                #{tag}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => removeTag(tag)}
                                                hitSlop={4}
                                            >
                                                <Ionicons name="close" size={16} color="#ffffff" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Toggle Options */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: textColor }]}>
                            Options
                        </Text>

                        <View style={styles.toggleContainer}>
                            <View style={styles.toggleRow}>
                                <Text style={[styles.toggleLabel, { color: textColor }]}>
                                    Favorites Only
                                </Text>
                                <Switch
                                    value={filters.favoritesOnly}
                                    onValueChange={(value) => updateFilter('favoritesOnly', value)}
                                    trackColor={{ false: borderColor, true: accentColor }}
                                    thumbColor="#ffffff"
                                />
                            </View>

                            <View style={styles.toggleRow}>
                                <Text style={[styles.toggleLabel, { color: textColor }]}>
                                    Has Full Content
                                </Text>
                                <Switch
                                    value={filters.hasContent}
                                    onValueChange={(value) => updateFilter('hasContent', value)}
                                    trackColor={{ false: borderColor, true: accentColor }}
                                    thumbColor="#ffffff"
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={[styles.footer, { borderTopColor: borderColor }]}>
                    <CustomButton
                        title="Apply Filters"
                        onPress={handleApply}
                        disabled={!isFilterActive()}
                        style={styles.applyButton}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: '600',
    },
    clearText: {
        fontSize: typography.sizes.sm,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        padding: spacing.md,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.sizes.md,
        fontWeight: '600',
        marginBottom: spacing.sm,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    optionButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: spacing.sm,
        borderWidth: 1,
        minWidth: 80,
        alignItems: 'center',
    },
    optionText: {
        fontSize: typography.sizes.sm,
        fontWeight: '500',
    },
    tagInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    tagInput: {
        flex: 1,
    },
    addTagButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedTagsContainer: {
        marginTop: spacing.sm,
    },
    selectedTagsTitle: {
        fontSize: typography.sizes.sm,
        marginBottom: spacing.sm,
    },
    selectedTagsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    selectedTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.sm,
        gap: spacing.xs,
    },
    selectedTagText: {
        fontSize: typography.sizes.sm,
        fontWeight: '500',
    },
    toggleContainer: {
        gap: spacing.md,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toggleLabel: {
        fontSize: typography.sizes.md,
    },
    footer: {
        padding: spacing.md,
        borderTopWidth: 1,
    },
    applyButton: {
        width: '100%',
    },
}); 