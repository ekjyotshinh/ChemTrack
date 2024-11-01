// Import necessary libraries and components
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Define the SignUpPage component
export default function SignUpPage() {
  // State variables for email, password, and selected school
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('Encina High School');
  const router = useRouter();  // Initialize router for navigation

  // Function to handle the "Next" button press
  const handleNextPress = () => {
    Alert.alert("Next button pressed!");  // Notify the user of button press
    router.push('/signupPage2');          // Navigate to the updated next signup page
  };

  // Function to handle the "Back" button press
  const handleBackPress = () => {
    router.push('/login');                // Navigate back to the login page
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
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>School</Text>
        <Picker
          selectedValue={selectedSchool}
          onValueChange={(itemValue) => setSelectedSchool(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Encina High School" value="Encina High School" />
        </Picker>
      </View>

      {/* "Next" button to proceed to the next signup page */}
      <TouchableOpacity onPress={handleNextPress} style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Next</Text>
        <Ionicons name="arrow-forward" size={24} color="white" style={styles.nextButtonIcon} />
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
