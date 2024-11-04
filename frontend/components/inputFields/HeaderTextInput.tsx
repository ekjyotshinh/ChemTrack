import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import CustomTextBox from './CustomTextBox';
import CustomTextHeader from './CustomTextHeader';

// Pass onChange function and the header string
interface TextProps {
    headerText: string,
    value: string,
    onChangeText: (text: string) => void,
    inputWidth?: number,
    isNumeric?: boolean,
}

export default function HeaderTextInput({ headerText, onChangeText, inputWidth, isNumeric, value }: TextProps) {
    return (
        // If input width is provided use that, otherwise just make it 100%
        <View style={{ width: inputWidth || '100%' }}>
            <CustomTextHeader headerText={headerText} />
            {
            // If numeric, then only allow numeric input and show #
            isNumeric ?
                <View style={styles.container}>
                    <Text style={styles.hashtag}>{'#'}</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        onChangeText={onChangeText}
                        value={value}
                    />
                </View> 
            // Otherwise show normal textbox
            : 
                <CustomTextBox onChangeText={onChangeText} value={value} />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        marginTop: 0,
        borderWidth: 1,
        borderColor: '#BFBFBF',
        backgroundColor: '#FFFFFF',
        flex: 1,
        flexDirection: 'row'
    },
    hashtag: {
        color: '#BFBFBF',
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 7,
        paddingRight: 4,
    },
    input: {
        fontSize: 15,
        width: 55,
    }
});