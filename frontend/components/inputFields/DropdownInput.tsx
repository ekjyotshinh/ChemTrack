import Colors from '@/constants/Colors';
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
    const [textColor, setTextColor] = useState<string>('black')

    const onChange = (item : any) => {
        setValue(item.value)
        if (item.label === 'Fair') {
            setTextColor(Colors.blue)
        } else if (item.label === 'Good') {
            setTextColor(Colors.green)
        } else if (item.label == 'Low') {
            setTextColor(Colors.yellow)
        } else if (item.label == 'Off-site'){
            setTextColor(Colors.red)
        } else {
            setTextColor('black')
        }
    }

    return (
        <Dropdown
            style={styles.container}
            selectedTextStyle={[styles.selectedTextStyle, {color: textColor}]}
            iconStyle={styles.iconStyle}
            iconColor={Colors.grey}
            maxHeight={150}
            placeholder={''}
            value={value}
            data={data} 
            labelField='label' 
            valueField='value' 
            onChange={item => {
                onChange(item)
            }} 
        />
    )
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        marginTop: 0,
        borderWidth: 1,
        borderColor: Colors.grey,
        backgroundColor: Colors.white,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 15,
        fontFamily: 'Inter_400Regular'
    },
      selectedTextStyle: {
        fontSize: 15,
        fontFamily: 'Inter_400Regular'
      },
      iconStyle: {
        width: 30,
        height: 30,
        marginRight: 5,
      },
});
