import React from 'react';
import { Text, View } from 'react-native';

import { queueStyles as styles } from '../../styles/queue';

export default function EmptyQueueState() {
    return (
        <View style={styles.emptyQueue}>
            <Text style={styles.emptyQueueText}>Your queue is empty</Text>
            <Text style={styles.emptyQueueSubtext}>Add articles to your queue to read later</Text>
        </View>
    );
} 