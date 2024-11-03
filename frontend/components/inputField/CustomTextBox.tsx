import React, { forwardRef } from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface TextProps {
    width?: number,
    isCenter?: boolean,
    onChangeText?: (text: string) => void, // if you want to input your
    [key: string]: any, // allows any additional TextInput props
}
const CustomTextBox = forwardRef<TextInput, TextProps>(
    ({ onChangeText, width, isCenter, ...props }, ref) => {

    return (
        <TextInput
            {...props}
            style={[
                styles.input,
                { width: width },
                { textAlign: isCenter ? 'center' : 'left' },
                { paddingLeft: isCenter ? 0 : 15 }
            ]}
            onChangeText={onChangeText}
            ref={ref}
        />
    );
}
)

const styles = StyleSheet.create({
    input: {
        height: 40,
        marginTop: 0,
        borderWidth: 1,
        borderColor: '#BFBFBF',
        backgroundColor: '#FFFFFF',
        fontSize: 15,
    },
});

export default CustomTextBox