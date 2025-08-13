import { StyleSheet } from 'react-native';

export const welcomeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF474C',
    },
    header: {
        backgroundColor: '#FF474C',
        paddingHorizontal: 32,
        paddingTop: 20,
        paddingBottom: 40,
        position: 'relative',
    },
    patternOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
    },
    patternContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingTop: 20,
    },
    patternItem: {
        width: 40,
        height: 20,
        backgroundColor: '#FFFFFF',
        margin: 4,
        borderRadius: 4,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        opacity: 0.9,
    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 32,
        paddingTop: 40,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 32,
    },
    spacer: {
        flex: 0.3,
    },
    welcomeTextContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 24,
        opacity: 0.9,
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 40,
        gap: 16,
    },
}); 