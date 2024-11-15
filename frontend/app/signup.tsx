import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import Colors from '@/constants/Colors';
import Size from '@/constants/Size';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import CustomTextHeader from '@/components/inputFields/CustomTextHeader';
import DropdownInput from '@/components/inputFields/DropdownInput';
import TextInter from '@/components/TextInter';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const router = useRouter();

  const schools = [
    { label: 'Encina High School', value: '1' },
    { label: 'Sacramento High School', value: '2' },
    { label: 'Foothill High School', value: '3' },
    { label: 'Grant Union High School', value: '4' },
  ]

  const handleSignup = () => {
    Alert.alert('Signup successful');
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      
        <ScrollView style={{width: '100%'}}>
        <View style={styles.innerContainer}>
          <View style={{alignSelf: 'center'}}>
          <TextInter style={[styles.brand, styles.blue]}>
            Chem<TextInter style={[styles.brand, styles.black]}>Track</TextInter>
          </TextInter>
          </View>
          <TextInter style={styles.subtitle}>
            <TextInter style={styles.black}>A </TextInter>
            <TextInter style={styles.blue}>chemical inventory manager </TextInter>
            <TextInter style={styles.black}>with QR code scanning </TextInter>
            <TextInter style={styles.blue}>built for schools.</TextInter>
          </TextInter>

          
          <HeaderTextInput
              onChangeText={email => setEmail(email)}
              headerText={'Email'}
              value={email}
              keyboardType='email-address'
              autoCapitalize='none' 
          />
          <View style={{height: Size.height(10)}}/>
          <HeaderTextInput
            headerText={'Password'}
            value={password}
            onChangeText={(password) => { setPassword(password) }}
            secureTextEntry={true}
            autoCapitalize='none'
          />
          <View style={{height: Size.height(10)}}/>
          <View>
            <CustomTextHeader headerText='School' />
            <DropdownInput data={schools} value={school} setValue={setSchool} />
          </View>

          <View style={{height: Size.height(90)}}/>
          {/* Use CustomButton for the signup button */}
          <CustomButton 
          title="Next" 
          onPress={handleSignup} 
          width={337} 
          color={(!password || !email || !school) ? Colors.white : Colors.blue}
          textColor={(!password || !email || !school) ? Colors.grey : Colors.white}
          />

          {/* Link to the login page */}
          <Text onPress={() => router.push('/login')} style={styles.link}>
            Already have an account? Log In
          </Text>
          </View>
        </ScrollView>
      </View>
    
  );
}

const styles = StyleSheet.create({
  black: { color: Colors.black, fontWeight: 'bold' },
  blue: { color: Colors.blue, fontWeight: 'bold' },
  container: {
    flex: 1,
    backgroundColor: Colors.offwhite,
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerContainer: {
    marginTop: Size.height(100),
    marginHorizontal: Size.width(33),
  },
  brand: { fontSize: 55, fontWeight: 'bold', },
  subtitle: { fontSize: 16, color: Colors.black, marginBottom: 30, textAlign: 'center' },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: '#000',
    fontWeight: 'bold',
  },
  link: { marginTop: 15, color: 'blue', textAlign: 'center', fontWeight: 'bold' },
});
