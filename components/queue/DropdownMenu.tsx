import React from 'react';
import { Image } from 'expo-image';
import { Text, TouchableOpacity, View } from 'react-native';

import { queueStyles as styles } from '../../styles/queue';

interface DropdownItem {
    id: string;
    title: string;
    icon?: any;
    hasSeparator?: boolean;
}

interface DropdownMenuProps {
    visible: boolean;
    containerStyle: any;
    items: DropdownItem[];
    onItemPress: (itemId: string) => void;
}

export default function DropdownMenu({ visible, containerStyle, items, onItemPress }: DropdownMenuProps) {
    if (!visible) return null;

    return (
        <View style={containerStyle}>
            <View style={styles.dropdownMenu}>
                {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => onItemPress(item.id)}
                        >
                            {item.icon && (
                                <Image source={item.icon} style={styles.dropdownIcon} />
                            )}
                            <Text style={styles.dropdownText}>{item.title}</Text>
                        </TouchableOpacity>

                        {item.hasSeparator && index < items.length - 1 && (
                            <View style={styles.dropdownSeparator} />
                        )}
                    </React.Fragment>
                ))}
            </View>
        </View>
    );
} 