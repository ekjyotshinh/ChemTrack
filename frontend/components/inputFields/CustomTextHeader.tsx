import React from 'react'
import { StyleSheet, Text } from 'react-native'
import TextInter from '../TextInter'

interface HeaderProps {
    headerText: string,
}

export default function CustomTextHeader({ headerText }: HeaderProps) {
    return (
        <TextInter style={styles.header}>{headerText}</TextInter>
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
