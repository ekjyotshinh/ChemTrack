import React, { RefObject, useRef } from 'react'
import CustomTextBox from './CustomTextBox'
import { TextInput, View, StyleSheet } from 'react-native'

interface CasProps {
    casParts: string[]
    setCasParts: React.Dispatch<React.SetStateAction<string[]>>
}

export default function CasTextBoxes({ casParts, setCasParts }: CasProps) {

    // refs for shifting focus and keeping track of CAS number inputs
    const casRefs: RefObject<TextInput>[] =
        [
            useRef<TextInput>(null),
            useRef<TextInput>(null),
            useRef<TextInput>(null),
        ]

    // horizontal divider line
    const Divider = () => {
        return (
            <View style={styles.line} />
        )
    }

    // for when we need to shift focus to another section for CAS number
    const onCasChange = (value: string, index: number, maxLength: number) => {
        const newCasParts = [...casParts]
        newCasParts[index] = value
        setCasParts(newCasParts)

        if (value.length === maxLength && index < casParts.length - 1) {
            casRefs[index + 1].current?.focus()
        }
    }

    // handle backspace, shift focus to previous textbox if empty
    const onCasKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key == 'Backspace' && casParts[index] == '' && index > 0) {
            casRefs[index - 1].current?.focus()
        }
    }

    // handle next button, shift to next textbox, or if last textbox do nothing
    const onCasSubmit = (index: number) => {
        if (index < casParts.length - 1) {
            casRefs[index + 1].current?.focus()
        } else {
            console.log(casParts)
        }
    }

    // helper function for the CAS number text box
    const CasTextBox = (index: number, width: number, maxLength: number, isNext: boolean) => (
        <CustomTextBox
            keyboardType='numeric'
            onChangeText={(value: string) => onCasChange(value, index, maxLength)}
            ref={casRefs[index]}
            width={width}
            isCenter={true}
            maxLength={maxLength}
            onKeyPress={(e: any) => { onCasKeyPress(e, index) }}

            // keyboard has next option to go to next field
            returnKeyType={isNext ? 'next' : 'done'}
            onSubmitEditing={() => { onCasSubmit(index) }}
        />
    )

    return (
        <View style={styles.container}>
            {CasTextBox(0, 135, 7, true)}
            <Divider />
            {CasTextBox(1, 75, 2, true)}
            <Divider />
            {CasTextBox(2, 40, 1, false)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    line: {
        height: 2,
        backgroundColor: '#000000',
        width: 10,
        alignSelf: 'center',
        borderRadius: 2,
    },
});