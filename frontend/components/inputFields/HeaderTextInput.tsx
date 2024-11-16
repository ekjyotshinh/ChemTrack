import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import CustomTextBox from './CustomTextBox';
import CustomTextHeader from './CustomTextHeader';
import Colors from '@/constants/Colors';
import TextInter from '../TextInter';
import Size from '@/constants/Size';

// Pass onChange function and the header string
interface TextProps {
    headerText: string,
    value: string,
    onChangeText: (text: string) => void,
    inputWidth?: number,
    isNumeric?: boolean,
    hasIcon?: boolean,
    [key: string]: any, // allows any additional TextInput props
}

export default function HeaderTextInput({ headerText, onChangeText, inputWidth, isNumeric, hasIcon, value, ...props }: TextProps) {
    return (
        // If input width is provided use that, otherwise just make it 100%
        <View style={{ width: inputWidth || '100%' }}>
            <CustomTextHeader headerText={headerText} />
            {
            // If numeric, then only allow numeric input and show #
            isNumeric ?
                <View style={styles.container}>
                    <TextInter style={styles.hashtag}>{'#'}</TextInter>
                    <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        onChangeText={onChangeText}
                        value={value}
                    />
                </View> 
            // Otherwise show normal textbox
            : 
                <CustomTextBox {...props} onChangeText={onChangeText} hasIcon={hasIcon} value={value} />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Size.height(40),
        marginTop: 0,
        borderWidth: 1,
        borderColor: Colors.grey,
        backgroundColor: Colors.white,
        flex: 1,
        flexDirection: 'row'
    },
    hashtag: {
        color: Colors.grey,
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