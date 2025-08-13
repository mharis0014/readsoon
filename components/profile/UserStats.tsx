import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '../layout/ThemedView';
import { Stat } from '../profile/Stat';

interface UserStatsProps {
    stats: {
        number: string;
        label: string;
    }[];
    cardBackgroundColor: string;
    subtitleColor: string;
    paddingVertical: number;
    paddingHorizontal: number;
    borderRadius: number;
    marginBottom: number;
}

/**
 * Professional user stats component
 */
export function UserStats({
    stats,
    cardBackgroundColor,
    subtitleColor,
    paddingVertical,
    paddingHorizontal,
    borderRadius,
    marginBottom
}: UserStatsProps) {
    return (
        <ThemedView
            style={[
                styles.statsContainer,
                {
                    backgroundColor: cardBackgroundColor,
                    paddingVertical,
                    paddingHorizontal,
                    borderRadius,
                    marginBottom,
                },
            ]}
        >
            {stats.map((stat, index) => (
                <React.Fragment key={stat.label}>
                    <Stat
                        num={stat.number}
                        label={stat.label}
                        subtitleColor={subtitleColor}
                    />
                    {index < stats.length - 1 && <View style={styles.statDivider} />}
                </React.Fragment>
            ))}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#e0e0e0',
        alignSelf: 'stretch',
        marginHorizontal: 8,
    },
}); 