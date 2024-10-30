import CustomButton from '@/components/CustomButton';
import CustomTextInput from '@/components/CustomTextInput';
import Header from '@/components/Header';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

export default function ViewChemicals() {
  const [text, setText] = useState<string>('')

  return (
    <View style={styles.container}>
      <Header headerText='Add Chemical' />
      <CustomTextInput headerText='Name' setText={setText} />

      {/* Button to test text input */}
      <CustomButton title={'Test'} onPress={() => {console.log(text)}} width={75}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '8%'
  },
});
