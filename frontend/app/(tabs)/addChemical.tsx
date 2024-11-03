import CustomButton from '@/components/CustomButton';
import CustomTextInput from '@/components/CustomTextInput';
import Header from '@/components/Header';
import CustomTextBox from '@/components/inputField/CustomTextBox';
import CustomTextHeader from '@/components/inputField/CustomTextHeader';
import React, { RefObject, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput } from 'react-native';

export default function ViewChemicals() {
  const [name, setName] = useState<string>('')

  // stuff for shifting focus and keeping track of CAS number inputs
  const [casParts, setCasParts] = useState<string[]>(['', '', ''])
  const casRefs: RefObject<TextInput>[] = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null)]

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

  const onCasKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key == 'Backspace' && casParts[index] == '' && index > 0) {
      casRefs[index - 1].current?.focus()
    }
  }

  const onCasSubmit = (index : number) => {
    if (index < casParts.length - 1) {
      casRefs[index + 1].current?.focus()
    } else {
      console.log(casParts)
    }
  }

  const CasTextBox = (index: number, width: number, maxLength: number, isNext: boolean) => (
    <CustomTextBox
      keyboardType='numeric'
      onChangeText={(value: string) => onCasChange(value, index, maxLength)}
      ref={casRefs[index]}
      width={width}
      isCenter={true}
      maxLength={maxLength}
      onKeyPress={(e: any) => {onCasKeyPress(e, index)}}
      returnKeyType={isNext ? 'next' : 'done'}
      onSubmitEditing={() => {onCasSubmit(index)}}
    />
  )

  return (
    <View style={styles.container}>
      <Header headerText='Add Chemical' />
      <ScrollView style={styles.scroll}>
        <View style={styles.innerContainer}>

          {/* Name */}
          <CustomTextInput
            headerText='Name'
            onChangeText={(value: string) => { setName(value) }}
          />

          {/* CAS Number */}
          <CustomTextHeader headerText='CAS Number' />
          <View style={styles.cas}>
            {CasTextBox(0, 135, 7, true)}
            <Divider />
            {CasTextBox(1, 75, 2, true)}
            <Divider />
            {CasTextBox(2, 40, 1, false)}

          </View>

          {/* Button to test text input */}
          <CustomButton title={'Test'} onPress={() => { console.log(JSON.stringify(casParts)) }} width={75} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9'
  },
  innerContainer: {
    marginTop: 150,
    marginHorizontal: '8%'
  },
  scroll: {
    width: '100%',
  },
  cas: {
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
