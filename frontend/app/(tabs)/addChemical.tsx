import CustomButton from '@/components/CustomButton';
import CustomTextInput from '@/components/CustomTextInput';
import Header from '@/components/Header';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

export default function ViewChemicals() {
  const [text, setText] = useState<string>('')

  return (
    <View style={styles.container}>
      <Header headerText='Add Chemical' />
      <ScrollView style={styles.scroll}>
        <View style={styles.innerContainer}>
          <CustomTextInput headerText='Name' setText={setText} />
          {/* Button to test text input */}
          <CustomButton title={'Test'} onPress={() => { console.log(text) }} width={75} />
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
  },
  innerContainer: {
    marginTop: 150,
    marginHorizontal: '8%'
  },
  scroll: {
    width: '100%',
  }
});
