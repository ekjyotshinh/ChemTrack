import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { useUser } from '@/contexts/UserContext'; // Import the hook
import LoginIcon from '@/assets/icons/LoginIcon';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import TextInter from '@/components/TextInter';
import Size from '@/constants/Size';
import Colors from '@/constants/Colors';
import emailRegex from '@/functions/EmailRegex';
import Loader from '@/components/Loader';
import { API_URL } from '@/constants/API';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [isValidEmail, setIsValidEmail] = useState(false);
  emailRegex({ email, setIsValidEmail });

  const { updateUserInfo } = useUser(); // Use the updateUserInfo function from context

  const handleLogin = async () => {
    if (!email || !password || !isValidEmail) {
      Alert.alert('Please enter a valid email and password');
      return;
    }
    setLoading(true);

    const url = `${API_URL}/api/v1/login`;

    try {
      // API call to authenticate the user
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response status is OK (200-299)
      if (!response.ok) {
        const data = await response.json();
        setLoading(false); // Stop loader
        Alert.alert(data.error || 'Invalid credentials');
        return;
      }

      // Parse the response data
      const data = await response.json();
      //console.log(data); // Log the complete response for debugging

      // Successfully logged in, update context with user info
      updateUserInfo({
        name: `${data.user.first} ${data.user.last}`,  // Using `first` and `last` from the user object
        email: data.user.email,  // Using `email` from the user object
        is_admin: data.user.is_admin,  // Using `is_admin` from the user object
        is_master: data.user.is_master,  // Using `is_master` from the user object
        school: data.user.school,  // Ensure `school` exists in the response, if not, adjust as needed
        id: data.user.id, // Get the user id generated by Firestore
        allow_email: data.user.allow_email,
        allow_push: data.user.allow_push,
      });
      setLoading(false); // Stop loader

      // Successfully logged in, redirect to the main page
      router.replace('/(tabs)');
    } catch (error) {
      setLoading(false); // Stop loader
      // Handle network or other errors
      console.error('Login error:', error);
      Alert.alert('Something went wrong, please try again later');
    }
  };


  return (
    <View style={styles.container}>
      <Loader visible={loading} message="Logging in..." />
      <ScrollView style={{ width: '100%' }}>
        <View style={styles.innerContainer}>
          <View style={{ alignSelf: 'center' }}>
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

          <View style={{ height: Size.height(20) }} />

          <HeaderTextInput
            onChangeText={email => setEmail(email)}
            headerText={'Email'}
            value={email}
            keyboardType='email-address'
            autoCapitalize='none'
            hasIcon={true}
            testID="email-input"
          />

          <View style={{ height: Size.height(10) }} />

          <HeaderTextInput
            headerText={'Password'}
            value={password}
            onChangeText={(password) => { setPassword(password) }}
            secureTextEntry={true}
            autoCapitalize='none'
            hasIcon={true}
            testID="password-input"
          />

          {/* Add Forgot Password link here */}
          <View style={{ width: '100%', alignItems: 'flex-end', marginTop: 8 }}>
            <TextInter 
              onPress={() => router.push('/(auth)/resetPassword')} 
              style={styles.forgotPassword}
            >
              Forgot Password?
            </TextInter>
          </View> 

          <View style={{ height: Size.height(40) }} />

          {/* Use CustomButton for the login button */}
          <CustomButton
            title="Log In"
            onPress={handleLogin}
            width={337}
            color={(!password || !isValidEmail) ? Colors.white : Colors.blue}
            textColor={(!password || !isValidEmail) ? Colors.grey : Colors.white}
            icon={<LoginIcon width={24} height={24} color={(!password || !isValidEmail) ? Colors.grey : Colors.white} />}
            iconPosition='left'
          />

          {/* Link to the signup page 
          <TextInter onPress={() => router.push('/signupPage1')} style={styles.link}>
            Don't have an account? Sign-up
          </TextInter>
          */}
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
    marginTop: Size.height(110),
    marginHorizontal: Size.width(33),
    alignItems: 'center',
  },
  brand: { fontSize: 55, fontWeight: 'bold', },
  subtitle: { fontSize: 16, color: Colors.black, marginBottom: 30, textAlign: 'center' },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: '#000',
    fontWeight: 'bold',
  },
  link: { marginTop: 15, color: Colors.blue, textAlign: 'center', fontWeight: 'bold' },
  forgotPassword: { 
    alignSelf: 'flex-end', 
    marginTop: 10, 
    color: Colors.blue, 
    fontSize: 14,
    fontWeight: '600', // Make it slightly bolder
    padding: 5, // Add some padding to create a larger touch target
  },
});