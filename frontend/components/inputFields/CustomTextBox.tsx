import PencilIcon from '@/assets/icons/PencilIcon';
import Colors from '@/constants/Colors';
import React, { forwardRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface TextProps {
    width?: number,
    isCenter?: boolean,
    hasIcon?: boolean,
    onChangeText: (text: string) => void,
    [key: string]: any, // allows any additional TextInput props
}

// use forwardRef here to allow focus shifting
// e.g. move focus from one textbox to another when something happens 
const CustomTextBox = forwardRef<TextInput, TextProps>(
    ({ onChangeText, width, isCenter, hasIcon, ...props }, ref) => {
        return (
            <View style={[styles.container, hasIcon && styles.adjustIcon]}>
                <TextInput
                    {...props}
                    style={[
                        styles.input,
                        { width: width },
                        { textAlign: isCenter ? 'center' : 'left' },
                        { paddingLeft: isCenter ? 0 : 15 },
                        { fontFamily: 'Inter_400Regular'}
                    ]}
                    onChangeText={onChangeText}
                    ref={ref}
                />
                {hasIcon &&
                    <View style={styles.icon}>
                        <PencilIcon width={15} height={15} color={Colors.grey} />
                    </View>
                }
            </View>
        );
    }
)

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: Colors.grey,
        backgroundColor: Colors.white,
    },
    adjustIcon: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        marginTop: 0,
        fontSize: 15,
        overflow: 'hidden'
    },
    icon: {
        marginRight: 15,
    },
});

export default CustomTextBox