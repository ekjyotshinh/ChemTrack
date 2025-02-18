// Import necessary libraries and components
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import Size from '@/constants/Size';
import Colors from '@/constants/Colors';
import CustomTextHeader from '@/components/inputFields/CustomTextHeader';
import DropdownInput from '@/components/inputFields/DropdownInput';
import CustomButton from '@/components/CustomButton';
import BlueHeader from '@/components/BlueHeader';
import emailRegex from '@/functions/EmailRegex';

// Define the SignUpPage component
export default function SignUpPage() {
  // State variables for email, password, and selected school
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const router = useRouter();  // Initialize router for navigation

  const [isValidEmail, setIsValidEmail] = useState(false);
  emailRegex({ email, setIsValidEmail });

  // Temp array of hardcoded schools
  const schools = [
    { label: 'Encina High School', value: '1' },
    { label: 'Sacramento High School', value: '2' },
    { label: 'Foothill High School', value: '3' },
    { label: 'Grant Union High School', value: '4' },
  ]

  // Function to handle the "Next" button press
  const handleNextPress = () => {
    router.push({
      pathname: '/signupPage2',          // Navigate to the updated next signup page
      params: { email: email, password: password, selectedSchool: selectedSchool },
    });
  };

  // Function to handle the "Back" button press
  const handleBackPress = () => {
    router.push('/login');                // Navigate back to the login page
  };

  return (
    <View style={styles.container}>
      {/* Top bar with a "Back" button and title */}
      <BlueHeader headerText={'Sign Up'} onPress={handleBackPress} />
      <ScrollView style={{ width: '100%' }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ height: Size.height(15) }} />
          {/* Form fields for email, password, and school selection */}
          <View style={styles.formContainer}>

            <HeaderTextInput
              onChangeText={email => setEmail(email)}
              headerText={'Email'}
              value={email}
              keyboardType='email-address'
              autoCapitalize='none'
              hasIcon={true}
            />

            <View style={{ height: Size.height(10) }} />
            <HeaderTextInput
              headerText={'Password'}
              value={password}
              onChangeText={(password) => { setPassword(password) }}
              secureTextEntry={true}
              autoCapitalize='none'
              hasIcon={true}
            />
            <View style={{ height: Size.height(10) }} />

            <CustomTextHeader headerText='School' />
            <DropdownInput data={schools} value={selectedSchool} setValue={setSelectedSchool} />

          </View>
          <View style={{ height: Size.height(300) }} />
          {/* "Next" button to proceed to the next signup page */}
          <CustomButton
            iconPosition='right'
            title='Next'
            color={(!isValidEmail || !password || !selectedSchool) ? Colors.white : Colors.blue}
            textColor={(!isValidEmail || !password || !selectedSchool) ? Colors.grey : Colors.white}
            icon={
              <Ionicons
                name="arrow-forward"
                size={24}
                color={(!isValidEmail || !password || !selectedSchool) ? Colors.grey : Colors.white}
              />}
            onPress={handleNextPress}
            width={337}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

// Style definitions for the SignUpPage component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offwhite,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 99,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingHorizontal: 15,
  },
  backButton: {
    width: 40,
    alignItems: 'center',
  },
  topBarText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: Size.width(33),
    marginTop: Size.width(120),
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    height: height * 0.08,
    width: width * 0.9,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: height * 0.03,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nextButtonIcon: {
    position: 'absolute',
    right: width * 0.08,  // Adjust icon position based on screen width for responsiveness
  },
});