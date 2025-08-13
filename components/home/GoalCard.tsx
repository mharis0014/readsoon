import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { Colors } from '../../constants/Colors';
import ICONS from '../../constants/Icons';
import { homeStyles as styles } from '../../styles/home';

interface GoalCardProps {
    title?: string;
    goal?: string;
    progress?: number; // 0 to 1
    percentage?: number; // 0 to 100
}

const GoalCardComponent = ({
    title = "Today's Goal",
    goal = "Read for 30 minutes",
    progress = 0.67,
    percentage
}: GoalCardProps) => {
    const displayPercentage = percentage ?? Math.round(progress * 100);
    const progressValue = percentage ? percentage / 100 : progress;

    return (
        <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{title}</Text>
                <View style={styles.goalIcon}>
                    <Image source={ICONS.BOOK} style={styles.bookIcon} />
                </View>
            </View>
            <Text style={styles.goalText}>{goal}</Text>
            <View style={styles.progressContainer}>
                <Progress.Bar
                    progress={progressValue}
                    width={null}
                    height={6}
                    color={Colors.red}
                    unfilledColor={Colors.lightGray}
                    borderWidth={0}
                    borderRadius={4}
                />
            </View>
            <Text style={styles.percentage}>{displayPercentage}% complete</Text>
        </View>
    );
};

export const GoalCard = React.memo(GoalCardComponent); 