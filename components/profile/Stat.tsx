import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../layout/ThemedText';

type StatProps = {
    num: string;
    label: string;
    subtitleColor: string;
};

/**
 * Stat component for displaying user statistics
 */
export function Stat({ num, label, subtitleColor }: StatProps) {
    return (
        <View style={styles.statItem}>
            <ThemedText type="subtitle" style={styles.statNumber}>
                {num}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: subtitleColor }]}>{label}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
    },
}); 