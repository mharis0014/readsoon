import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
    type?: 'default' | 'title' | 'subtitle' | 'link';
};

/**
 * Simple text component
 */
export function ThemedText({
    style,
    type = 'default',
    ...rest
}: ThemedTextProps) {
    return (
        <Text
            style={[
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
        color: '#000000',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
        color: '#000000',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4',
    },
}); 