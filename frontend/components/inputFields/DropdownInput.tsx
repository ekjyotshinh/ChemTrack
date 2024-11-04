import React, { useState } from 'react'
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface DropdownProps {
    data: {
        label: string
        value: string
    }[],
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
}

export default function DropdownInput({ data, value, setValue } : DropdownProps) {
    return (
        <Dropdown
            style={styles.container}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            iconColor='#BFBFBF'
            maxHeight={150}
            placeholder={''}
            value={value}
            data={data} 
            labelField='label' 
            valueField='value' 
            onChange={item => {
                setValue(item.value)
            }} 
        />
    )
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        marginTop: 0,
        borderWidth: 1,
        borderColor: '#BFBFBF',
        backgroundColor: '#FFFFFF',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 15,
    },
      selectedTextStyle: {
        fontSize: 15,
      },
      iconStyle: {
        width: 30,
        height: 30,
        marginRight: 5,
      },
});
