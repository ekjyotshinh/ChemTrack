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
                <span style={styles.span}>
                    {list[0] + ' '}
                </span>
                {list[1]}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex controls height
        flex: 0.136,
        flexDirection: 'row',
        alignItems: 'flex-end',
        width: '100%',
    },
    span: {
        color: '#0F82FF',
    },
    header: {
        marginBottom: 11,
        fontSize: 30,
        fontWeight: 'bold',
    }
});
