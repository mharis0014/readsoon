import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { articleDetailStyles as styles } from '../../styles/article-detail';

interface ArticleErrorStateProps {
    title: string;
    subtitle?: string;
    buttonText?: string;
    onButtonPress?: () => void;
}

export default function ArticleErrorState({
    title,
    subtitle,
    buttonText,
    onButtonPress
}: ArticleErrorStateProps) {
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{title}</Text>
            {subtitle && <Text style={styles.errorSubtext}>{subtitle}</Text>}
            {buttonText && onButtonPress && (
                <TouchableOpacity style={styles.errorButton} onPress={onButtonPress}>
                    <Text style={styles.errorButtonText}>{buttonText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
} 