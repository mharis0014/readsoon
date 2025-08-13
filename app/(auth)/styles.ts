import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'blue',
        padding: 10,
        alignItems: 'center'

    },
    logoContainer: {
        height: 50,
        width: 50,
        backgroundColor: '#808080',
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    headerTextContainer: {
        flexDirection: 'column',
        padding: 1
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerSubText: {
        fontSize: 10,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    bodyContainer: {
        padding: 10
    },
    bottomContainer: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default styles;