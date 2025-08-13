import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '../../hooks/useThemeColor';
import { ThemedText } from '../layout/ThemedText';
import { CustomButton } from '../ui/CustomButton';
import { CustomInput } from '../ui/CustomInput';

type Props = {
    visible: boolean;
    onClose: () => void;
    onSave: (payload: { username: string; avatar: string }) => Promise<void> | void;
    initial: { username: string; avatar: string };
};

/**
 * Modal component for editing user profile information
 */
export default function EditProfileModal({ visible, onClose, onSave, initial }: Props) {
    const [username, setUsername] = useState(initial.username);
    const [avatar, setAvatar] = useState(initial.avatar);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const cardBg = useThemeColor({ light: 'rgba(255,255,255,0.85)', dark: 'rgba(0,0,0,0.6)' }, 'background');
    const text = useThemeColor({ light: '#333', dark: '#f5f5f5' }, 'text');
    const border = useThemeColor({ light: '#e6e6e6', dark: '#333' }, 'text');

    const insets = useSafeAreaInsets();

    // Reset fields each time modal opens with new initial
    useEffect(() => {
        if (visible) {
            setUsername(initial.username);
            setAvatar(initial.avatar);
            setErr(null);
        }
    }, [visible, initial]);

    const handleSave = async () => {
        if (!username.trim()) {
            setErr('Username is required');
            return;
        }
        setLoading(true);
        try {
            await onSave({ username: username.trim(), avatar: avatar.trim() });
            onClose();
        } catch (e: any) {
            setErr(e?.message ?? 'Failed to save');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose} // Android back button
        >
            {/* Dark backdrop. Press to close */}
            <Pressable style={styles.backdrop} onPress={onClose} />

            <KeyboardAvoidingView
                style={[styles.sheetWrap, { paddingBottom: insets.bottom || 16 }]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={[styles.sheet, { backgroundColor: cardBg, borderColor: border }]}>
                    {/* Grab handle */}
                    <View style={styles.handle} />

                    {/* Close icon */}
                    <Pressable style={styles.close} hitSlop={8} onPress={onClose}>
                        <Ionicons name="close" size={22} color={text} />
                    </Pressable>

                    <ThemedText type="title" style={styles.title}>
                        Edit Profile
                    </ThemedText>

                    <CustomInput
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        leftIcon={<Ionicons name="person-outline" size={18} color="#999" />}
                    />

                    <CustomInput
                        label="Avatar URL"
                        value={avatar}
                        onChangeText={setAvatar}
                        leftIcon={<Ionicons name="image-outline" size={18} color="#999" />}
                    />

                    {!!err && (
                        <ThemedText style={[styles.error, { color: '#ff3b30' }]}>
                            {err}
                        </ThemedText>
                    )}

                    <CustomButton
                        title="Save Changes"
                        onPress={handleSave}
                        loading={loading}
                        disabled={loading}
                        fullWidth
                        style={styles.saveButton}
                    />
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sheetWrap: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheet: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        borderTopWidth: 1,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#ccc',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    close: {
        position: 'absolute',
        top: 24,
        right: 24,
        zIndex: 1,
    },
    title: {
        marginBottom: 24,
        textAlign: 'center',
    },
    error: {
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
    },
    saveButton: {
        marginVertical: 16,
    },
}); 