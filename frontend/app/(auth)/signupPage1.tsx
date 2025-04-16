// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
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
import passwordRegex from '@/functions/PasswordRegex';
import fetchSchoolList from '@/functions/fetchSchool';

// Define the SignUpPage component
export default function SignUpPage() {
  // State variables for email, password, and selected school
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const router = useRouter();  // Initialize router for navigation
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  // Validate email
  emailRegex({ email, setIsValidEmail });
  // Validate password - at least one uppercase, one lowercase, one number, and one special character
  passwordRegex({ password, setIsValidPassword });
  // Function to handle the "Next" button press
  function handleNextPress() {
      if (!isValidEmail) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
      }
    
      if (!isValidPassword) {
        Alert.alert(
          'Invalid Password',
          'Password must be at least 8 characters and include one uppercase letter, one lowercase letter, one number, and one special character.'
        );
        return;
      }
    
      if (!selectedSchool) {
        Alert.alert('No School Selected', 'Please select a school to continue.');
        return;
      }
      
    if ((isValidEmail && isValidPassword && selectedSchool)) {
      router.push({
        pathname: '/signupPage2',
        params: { email: email, password: password, selectedSchool: selectedSchool },
      });
    } else {
      Alert.alert('Please enter a valid email, password and select a school');
    }
  }

  // Function to handle the "Back" button press
  const handleBackPress = () => {
    router.push('/login');                // Navigate back to the login page
  };

  const [schoolList, setSchoolList] = useState<any>([{label: '', value: ''}]);

  useEffect(() => {
    fetchSchoolList({setSchoolList});
  }, []);

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
            <DropdownInput data={schoolList} value={selectedSchool} setValue={setSelectedSchool} />

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