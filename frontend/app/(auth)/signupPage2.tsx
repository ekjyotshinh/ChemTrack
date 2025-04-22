// Import necessary libraries and components
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView } from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/contexts/UserContext'; // Import the hook
import BlueHeader from '@/components/BlueHeader';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import Size from '@/constants/Size';
import CustomButton from '@/components/CustomButton';
import Colors from '@/constants/Colors';
import Loader from '@/components/Loader';


// Define the SignUpPage2 component
export default function SignUpPage2() {
  const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { email, password, selectedSchool } = useLocalSearchParams();

  // Ensure you're extracting the actual string values by calling the functions
  const emailValue = Array.isArray(email) ? email[0] : email;  // Handle the case if email is an array
  const passwordValue = Array.isArray(password) ? password[0] : password;  // Handle the case if password is an array
  const selectedSchoolValue = Array.isArray(selectedSchool) ? selectedSchool[0] : selectedSchool;  // Handle the case if selectedSchool is an array

  // Log the values to check them
  console.log('Email:', emailValue);
  console.log('Password:', passwordValue);
  console.log('Selected School:', selectedSchoolValue);

  const { updateUserInfo } = useUser(); // Use the updateUserInfo function from context

  // Handle Create Account button press
  const handleCreateAccountPress = async () => {
    // only proceed if there is firstname and last name
    if(!firstName){
      Alert.alert('Please enter a first name');
      return;
    }
    if(!lastName){
      Alert.alert('Please enter a last name');
      return;
    }
      
    setLoading(true);

    const url = `${API_URL}/api/v1/users`;
    const userData = {
      first: firstName,
      last: lastName,
      email: emailValue,  // Use the extracted email value here
      password: passwordValue,  // Use the extracted password value here
      school: selectedSchoolValue,  // Use the extracted selected school here
      is_admin: false,
      is_master: false,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        // After successfully creating the user, update context and navigate
        const data = await res.json();
        console.log(data);
        updateUserInfo({
          name: `${firstName} ${lastName}`,
          email: emailValue,
          is_admin: false,
          is_master: false,
          school: selectedSchoolValue,
          id: data.user.id,
          allow_email: false,
          allow_push: false,
        });
        setLoading(false); // Stop loader
        router.replace('/(tabs)');
      } else if (res.status === 409) {
        setLoading(false); // Stop loader
      Alert.alert("Account already exists", "An account already exists with this email.");
      } else {
        const data = await res.json();
        setLoading(false); // Stop loader
        Alert.alert(data.error);
        router.push('/signupPage1');
      }
    } catch (error) {
      setLoading(false); // Stop loader
      Alert.alert("Error creating Account!");
      router.push('/signupPage1'); // Navigate back to the first signup page on error
    }
  };

  // Handle Back button press
  const handleBackPress = () => {
    router.push('/signupPage1');                // Navigate back to the login page
  };

  return (

    <View style={styles.container}>
      <Loader visible={loading} message="Creating an Account..." />
      {/* Top bar with a "Back" button and title */}
      <BlueHeader headerText={'Sign Up'} onPress={handleBackPress} />
      <ScrollView style={{ width: '100%' }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ height: Size.height(15) }} />
          {/* Form fields for email, password, and school selection */}
          <View style={styles.formContainer}>
            <HeaderTextInput
              value={firstName}
              onChangeText={(first) => { setFirstName(first) }}
              headerText={'First Name'}
              hasIcon={true}
            />

            <View style={{ height: Size.height(10) }} />

            <HeaderTextInput
              value={lastName}
              onChangeText={(last) => { setLastName(last) }}
              headerText={'Last Name'}
              hasIcon={true}
            />
          </View>

          <View style={{ height: Size.height(377) }} />

          {/* "Create Account" button to proceed to the next signup page */}
          <CustomButton
            iconPosition='right'
            title='Create Account'
            color={(!firstName || !lastName) ? Colors.white : Colors.blue}
            textColor={(!firstName || !lastName) ? Colors.grey : Colors.white}
            icon={
              <Ionicons
                name="checkmark"
                size={24}
                color={(!firstName && !lastName) ? Colors.grey : Colors.white}
              />}
            onPress={handleCreateAccountPress}
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
    backgroundColor: '#F5F5F5',
    justifyContent: 'flex-start',
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
    paddingHorizontal: width * 0.08,
    marginTop: 120,
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
  createAccountButton: {
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
  createAccountButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  createAccountButtonIcon: {
    position: 'absolute',
    right: width * 0.08,  // Adjust icon position based on screen width for responsiveness
  },
});
