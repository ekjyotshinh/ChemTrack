import CustomButton from '@/components/CustomButton';
import CustomTextInput from '@/components/CustomTextInput';
import Header from '@/components/Header';
import CustomTextBox from '@/components/inputField/CustomTextBox';
import CustomTextHeader from '@/components/inputField/CustomTextHeader';
import React, { RefObject, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput } from 'react-native';

export default function ViewChemicals() {
  const [name, setName] = useState<string>('')
  const [casParts, setCasParts] = useState<string[]>(['', '', ''])
  const casRefs: RefObject<TextInput>[] = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)]

  const Divider = () => {
    return (
      <View style={styles.line} />
    )
  }

  const onCasChange = (value : string, index : number, maxLength : number) => {
    const newCasParts = [...casParts]
    newCasParts[index] = value
    setCasParts(newCasParts)

    if (value.length === maxLength && index < casParts.length - 1) {
      if (casRefs[index + 1].current) {
        casRefs[index + 1].current?.focus()
      }
    }
  }

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
            <CustomTextBox
              keyboardType='numeric'
              onChangeText={(value: string) => onCasChange(value, 0, 7)}
              ref={casRefs[0]}
              width={135}
              isCenter={true}
              maxLength={7}
            />

            <Divider />

            <CustomTextBox
              keyboardType='numeric'
              onChangeText={(value: string) => onCasChange(value, 1, 2)}
              ref={casRefs[1]}
              width={75}
              isCenter={true}
              maxLength={2}
              />

            <Divider />

            <CustomTextBox
              keyboardType='numeric'
              onChangeText={(value: string) => onCasChange(value, 2, 1)}
              ref={casRefs[2]}
              width={40}
              isCenter={true}
              maxLength={1}
              />

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
