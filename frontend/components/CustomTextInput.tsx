import React from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';

// Pass the setter function from useState and the header string
interface TextProps {
    headerText: string,
    setText: React.Dispatch<React.SetStateAction<string>>,
}

export default function CustomTextInput({headerText, setText } : TextProps) {

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{headerText}</Text>
            <TextInput style={styles.input} onChangeText={(value) => {setText(value)}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
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
        width: 340,
    },
});
