import CustomButton from '@/components/CustomButton';
import CustomTextInput from '@/components/CustomTextInput';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ViewChemicals() {
  const [text, setText] = useState<string>('')

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Chemical</Text>
      <CustomTextInput headerText='Name' setText={setText}/>

      <CustomButton title={'Test'} onPress={() => {console.log(text)}} width={75}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
