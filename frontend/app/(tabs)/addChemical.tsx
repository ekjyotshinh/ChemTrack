import CustomButton from '@/components/CustomButton';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import Header from '@/components/Header';
import CustomTextHeader from '@/components/inputFields/CustomTextHeader';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput } from 'react-native';
import CasTextBoxes from '@/components/inputFields/CasTextBoxes';

export default function ViewChemicals() {
  const [name, setName] = useState<string>('')
  const [room, setRoom] = useState<string>('')
  const [shelf, setShelf] = useState<string>('')
  const [cabinet, setCabinet] = useState<string>('')
  const [casParts, setCasParts] = useState<string[]>(['', '', ''])

  return (
    <View style={styles.container}>
      <Header headerText='Add Chemical' />
      <ScrollView style={styles.scroll}>
        <View style={styles.innerContainer}>

          {/* Name */}
          <HeaderTextInput
            headerText='Name'
            onChangeText={(value: string) => { setName(value) }}
          />

          {/* CAS Number */ }
          <CustomTextHeader headerText='CAS Number' />
          <CasTextBoxes casParts={casParts} setCasParts={setCasParts} />

          {/* Room, cabinet, shelf number */}
          <View style={styles.row}>
            <HeaderTextInput headerText={'Room'} onChangeText={(value : string) => setRoom(value)} inputWidth={111} />
            <HeaderTextInput headerText={'Shelf'} onChangeText={(value : string) => setCabinet(value)} inputWidth={88} />
            <HeaderTextInput headerText={'Cabinet'} onChangeText={(value : string) => setShelf(value)} inputWidth={88} />
          </View>

          {/* Button to test text input */}
          <CustomButton title={'Test'} onPress={() => { console.log(JSON.stringify(casParts)) }} width={80} />
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
    marginHorizontal: '8%',
  },
  scroll: {
    width: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});
