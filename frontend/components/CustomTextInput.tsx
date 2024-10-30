import React from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';

// Pass the setter function from useState and the header string
interface TextProps {
    headerText: string,
    setText: React.Dispatch<React.SetStateAction<string>>,
    inputWidth?: number,
}

export default function CustomTextInput({headerText, setText, inputWidth } : TextProps) {
    return (
        // If input width is provided use that, otherwise just make it 100%
        <View style={[styles.container, { width: inputWidth || '100%' }]}>
            <Text style={styles.header}>{headerText}</Text>
            <TextInput style={styles.input} onChangeText={(value) => {setText(value)}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'left',
        padding: 0,
        marginBottom: 3
    },
    input: {
        height: 40,
        marginTop: 0,
        borderWidth: 1,
        padding: 14,
        borderColor: '#BFBFBF',
        backgroundColor: '#FFFFFF',
        fontSize: 15,
        width: '100%',
    },
});
