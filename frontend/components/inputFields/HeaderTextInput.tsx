import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomTextBox from './CustomTextBox';
import CustomTextHeader from './CustomTextHeader';

// Pass onChange function and the header string
interface TextProps {
    headerText: string,
    onChangeText: (text: string) => void,
    inputWidth?: number,
}

export default function HeaderTextInput({headerText, onChangeText, inputWidth } : TextProps) {
    return (
        // If input width is provided use that, otherwise just make it 100%
        <View style={{ width: inputWidth || '100%' }}>
            <CustomTextHeader headerText={headerText} />
            <CustomTextBox onChangeText={onChangeText} />
        </View>
    );
}