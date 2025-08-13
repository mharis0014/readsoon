import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../layout/ThemedText';

interface AppLogoProps {
    subtitleColor?: string;
}

export function AppLogo({ subtitleColor }: AppLogoProps) {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.iconContainer}>
                    <ThemedText style={styles.icon}>📚</ThemedText>
                </View>
                <ThemedText style={styles.title}>readsoon</ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#0a7ea4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        shadowColor: '#0a7ea4',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    icon: {
        fontSize: 18,
        color: '#ffffff',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
        letterSpacing: -0.2,
    },
}); 