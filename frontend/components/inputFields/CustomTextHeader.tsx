import React from 'react'
import { StyleSheet, Text } from 'react-native'

interface HeaderProps {
    headerText: string,
}

export default function CustomTextHeader({ headerText }: HeaderProps) {
    return (
        <Text style={styles.header}>{headerText}</Text>
    )
}

const styles = StyleSheet.create({
    header: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'left',
        padding: 0,
        marginBottom: 3
    },
})
