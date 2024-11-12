// Import necessary libraries and components
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
//import { API_URL } from '@env';


// Define the SignUpPage2 component
export default function SignUpPage2() {


  // State variables for first name, last name
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const router = useRouter();  // Initialize router for navigation
  const{email, password, selectedSchool} = useLocalSearchParams();
const API_URL="http://IP:8080"
  // Function to handle the "Create Account" button press
  const handleCreateAccountPress = async () => {
    console.log(API_URL); // Logs the value of API_URL from .env
//  // call to the backend to authenticate
//  POST localhost:8080/api/v1/users/  <- create a user//
//  "first": "John",
//  "last": "Doe",
//  "email": "john@example.com",
//  "password": "password123",  
//  "school": "Echnia High School",
//  "is_admin": false,
//  "is_master": true//

    const url = API_URL+"/api/v1/users"
    const userData = {
      first : firstName,
      last : lastName,
      email : email,
      password : password,
      school : selectedSchool,
      is_admin : false,
      is_master : false
    }
    try{
      
      const res = await fetch(url,{
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(userData),

      });
      if(res.ok){
        //const responseData = await Response.json();
        Alert.alert("Create Account button pressed!");
        console.log("user created")
        router.push('/profile/profile');    
      } else{
        console.log("error");
      }
    }catch(error){
      console.log("error with transaction")
      router.push('/signupPage1');    
    };

      // Notify the user of button press
       // Navigate to the updated next signup page
  };

  // Function to handle the "Back" button press
  const handleBackPress = () => {
    router.push('/signupPage1');                // Navigate back to the login page
  };

  return (
    <View style={styles.container}>
      {/* Top bar with a "Back" button and title */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.topBarText}>Sign Up</Text>
      </View>

      {/* Form fields for email, password, and school selection */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
          //keyboardType="first-name"
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
          //keyboardType="last-name"
        />


        
      </View>

      {/* "Create Account" button to proceed to the next signup page */}
      <TouchableOpacity onPress={handleCreateAccountPress} style={styles.createAccountButton}>
        <Text style={styles.createAccountButtonText}>Create Account</Text>
        <Ionicons name="checkmark" size={24} color="white" style={styles.createAccountButtonIcon} />
      </TouchableOpacity>
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
