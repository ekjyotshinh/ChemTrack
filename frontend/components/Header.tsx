import React from 'react'
import { StyleSheet, View, Text} from 'react-native'

interface headerProps {
    headerText: string
}

export default function Header({ headerText } : headerProps) {

    // Split header text in 2 strings: 1st is blue, 2nd is black
    const list: string[] = headerText.split(' ')

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                <Text style={styles.span}>
                    {list[0] + ' '}
                </Text>
                {list[1]}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    // the header section should be sticky and not
    // be affected by scroll
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        width: '100%',
        paddingTop: 86,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: '#F9F9F9'
    },
    span: {
        color: '#0F82FF',
    },
    header: {
        marginBottom: 11,
        fontSize: 30,
        fontWeight: 'bold',
        // make sure this matches margin for
        // the screen so the text lines up
        marginHorizontal: '8%',
    }
});
