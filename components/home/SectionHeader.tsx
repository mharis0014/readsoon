import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
// eslint-disable-next-line import/no-named-as-default
import Colors from '../../constants/Colors';
import { homeStyles as styles } from '../../styles/home';

interface SectionHeaderProps {
    title: string;
    onPress: () => void;
    accessibilityLabel?: string;
}

const SectionHeaderComponent = ({ title, onPress, accessibilityLabel }: SectionHeaderProps) => (
    <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={onPress}
            accessible
            accessibilityLabel={accessibilityLabel || `See all ${title}`}
        >
            <Text style={styles.seeAllText}>See all</Text>
            <MaterialIcons name="keyboard-arrow-right" size={20} color={Colors.red} />
        </TouchableOpacity>
    </View>
);

export const SectionHeader = React.memo(SectionHeaderComponent); 