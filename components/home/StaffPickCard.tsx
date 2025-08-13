import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { homeStyles as styles } from '../../styles/home';

interface StaffPickCardProps {
    id: string;
    title: string;
    author: string;
    date: string;
    image: any;
    onPress?: () => void;
}

const StaffPickCardComponent = ({ id, title, author, date, image, onPress }: StaffPickCardProps) => {
    // Parse date to extract day and month
    const parseDate = (dateString: string) => {
        try {
            // Check if dateString is valid
            if (!dateString || dateString.trim() === '') {
                throw new Error('Empty date string');
            }
            
            // Create date object from the string
            const date = new Date(dateString);
            
            // Check if the date is valid
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            
            const day = date.getDate().toString();
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            return { day, month };
        } catch (error) {
            console.warn('Failed to parse date:', dateString, error);
            // Return current date as fallback
            const now = new Date();
            return { 
                day: now.getDate().toString(), 
                month: now.toLocaleDateString('en-US', { month: 'short' }) 
            };
        }
    };

    const { day, month } = parseDate(date);

    return (
        <TouchableOpacity
            style={styles.staffCard}
            onPress={onPress}
            accessible
            accessibilityLabel={`Staff pick: ${title} by ${author}`}
        >
            <Image
                source={image}
                style={styles.staffImage}
                contentFit="cover"
                transition={300}
            />
            <View style={styles.staffOverlay}>
                <View style={styles.dateBadge}>
                    <Text style={styles.dateNumber}>{day}</Text>
                    <Text style={styles.dateMonth}>{month}</Text>
                </View>
                <View style={styles.staffContent}>
                    <Text style={styles.staffAuthor}>{author}</Text>
                    <Text style={styles.staffTitle}>{title}</Text>
                    <Text style={styles.staffDesc}>Captures the glamour of 1940s Times Square with hand-crafted.</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export const StaffPickCard = React.memo(StaffPickCardComponent); 