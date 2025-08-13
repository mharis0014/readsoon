
import { BlurView } from 'expo-blur';
import React from 'react';
import { Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import ICONS from '../../constants/Icons';
import { spacing, typography } from '../../utils/responsive';

const { height: screenHeight } = Dimensions.get('window');

interface ShareModalProps {
    visible: boolean;
    onClose: () => void;
    onShareOption: (option: string) => Promise<void>;
}

interface ShareOption {
    id: string;
    title: string;
    icon: any;
}

const shareOptions: ShareOption[] = [
    { id: 'share-link', title: 'Share original link', icon: ICONS.FORWARD },
    { id: 'copy-link', title: 'Copy original link', icon: ICONS.LINK },
    { id: 'open-browser', title: 'Open in browser', icon: ICONS.BROWSER },
    { id: 'tweet', title: 'Tweet', icon: ICONS.AT },
    { id: 'print', title: 'Print', icon: ICONS.PRINT },
    { id: 'export-pdf', title: 'Export as PDF', icon: ICONS.EXPOPT },
];

export default function ShareModal({ visible, onClose, onShareOption }: ShareModalProps) {
    const handleOptionPress = async (optionId: string) => {
        try {
            await onShareOption(optionId);

            // For copy actions, close after showing the success message
            if (optionId === 'copy-link') {
                // Close after a brief delay to let user see the success feedback
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                // For other actions, close immediately
                onClose();
            }
        } catch (error) {
            console.error('Share option failed:', error);
            // Close modal even if there's an error
            onClose();
        }
    };

    const renderIcon = (option: ShareOption) => (
        <Image
            source={option.icon}
            style={{ width: typography.xxl, height: typography.xxl }}
            resizeMode="contain"
        />
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Blurred background */}
                <BlurView intensity={20} style={styles.blurContainer}>
                    <TouchableOpacity
                        style={styles.backdrop}
                        activeOpacity={1}
                        onPress={onClose}
                    />
                </BlurView>

                {/* Share modal */}
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Share</Text>
                        </View>

                        {/* Share options */}
                        <View style={styles.optionsContainer}>
                            {shareOptions.map((option, index) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={styles.optionButton}
                                    onPress={() => handleOptionPress(option.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.optionIcon}>
                                        {renderIcon(option)}
                                    </View>
                                    <Text style={styles.optionText}>{option.title}</Text>
                                    {index < shareOptions.length - 1 && <View style={styles.separator} />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    blurContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    backdrop: {
        flex: 1,
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: screenHeight * 0.6,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 20,
    },
    modalContent: {
        paddingBottom: spacing.xl,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
    },
    headerTitle: {
        fontSize: typography.lg,
        fontWeight: 'bold',
        color: Colors.black,
    },
    optionsContainer: {
        paddingTop: 0,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xs,
        minHeight: 64,
        position: 'relative',
    },
    optionIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    optionText: {
        fontSize: typography.md,
        color: Colors.black,
        fontWeight: '500',
        flex: 1,
    },
    separator: {
        position: 'absolute',
        bottom: 0,
        left: spacing.lg,
        right: spacing.lg,
        height: 1,
        backgroundColor: Colors.lightGray,
    },
}); 