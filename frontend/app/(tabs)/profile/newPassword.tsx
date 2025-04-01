import { useState } from 'react';  
import { View, ScrollView, Alert, StyleSheet } from 'react-native';  
import { useRouter } from 'expo-router';  
import CustomButton from '@/components/CustomButton';  
import Colors from '@/constants/Colors';   
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';  
import Size from '@/constants/Size';  
import TextInter from '@/components/TextInter';  
import LoginIcon from '@/assets/icons/LoginIcon';
import BlueHeader from '@/components/BlueHeader';
import emailRegex from '@/functions/EmailRegex';

export default function ResetPassword() {  
  const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isValidEmail, setIsValidEmail] = useState(false);
  emailRegex({ email, setIsValidEmail });
  
  const router = useRouter();  

  const handleResetPassword = async () => {
    if (!email || !isValidEmail) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    } 

    setIsLoading(true);

    try {
      // Make API request to initiate password reset
      console.log(`Sending request to ${API_URL}/api/v1/auth/forgot-password`);
      const response = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }); 

      console.log('Response status:', response.status);
      const data = await response.json(); 
      console.log('Response data:', data);

      if (response.ok) {
        // Check if we're in test mode with a direct token
        if (data.debug_token) {
          Alert.alert(
            'Test Mode - Reset Token',
            `Token: ${data.debug_token}\n\nIn production, this would be sent via email.`,
            [
              { 
                text: 'Use This Token', 
                onPress: () => {
                  // Try various navigation approaches to find one that works
                  try {
                    // Option 1: Full path with params object
                    router.push({
                      pathname: '/profile/newPassword',
                      params: { token: data.debug_token }
                    });
                  } catch (e) {
                    console.error("Navigation error:", e);
                    // Option 2: String path with query parameter
                    router.push(`/profile/newPassword?token=${data.debug_token}`);
                  }
                }
              },
              { text: 'Cancel' }
            ]
          );
        } else {
          Alert.alert(
            'Email Sent',
            'If your email is registered with us, you will receive password reset instructions shortly.',
            [{ text: 'OK', onPress: () => router.push('/login') }]
          );
        }
      } else {
        Alert.alert('Error', data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reset request:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };  

  const handleClear = () => {
    setEmail('');
  }

  return (  
    <View style={styles.container}>  
      <BlueHeader headerText={'Reset Password'} onPress={() => router.push('/login')} />  

      <ScrollView style={styles.scrollContainer}>  
        <View style={{ marginTop: Size.height(40) }}>  
          <TextInter style={styles.descriptionText}>  
            Enter your email address and we'll send you instructions to reset your password.  
          </TextInter>  

          <View style={{ alignItems: 'center', marginTop: Size.height(30) }}>  
            <HeaderTextInput  
              onChangeText={email => setEmail(email)}  
              headerText={'Email'}  
              value={email}  
              hasIcon={true}  
              inputWidth={Size.width(340)}  
              keyboardType='email-address'  
              autoCapitalize='none'  
              autoCorrect={false}
            />  
          </View>  

          <View style={styles.buttonContainer}>  
            <CustomButton  
              title={isLoading ? "Sending..." : "Send Reset Link"}  
              color={isValidEmail ? Colors.blue : Colors.white}
              textColor={isValidEmail ? Colors.white : Colors.grey}  
              onPress={handleResetPassword}  
              width={337}  
              icon={<LoginIcon width={24} height={24} color={isValidEmail ? Colors.white : Colors.grey} />}  
              iconPosition='left'
            />

            <CustomButton
              title="Clear"
              onPress={handleClear}
              color={Colors.red}
              width={327}
            />
          </View>  
        </View>  
      </ScrollView>  
    </View>  
  );  
}  

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    justifyContent: 'center',  
    backgroundColor: Colors.offwhite,  
    alignItems: 'center',  
  },  
  scrollContainer: {  
    width: '100%',  
  },  
  descriptionText: {  
    fontSize: 16,  
    color: Colors.grey,  
    textAlign: 'center',  
    paddingHorizontal: Size.width(20),  
    marginBottom: Size.height(20),  
  },  
  buttonContainer: {  
    alignItems: 'center',  
    marginTop: Size.height(40),  
    gap: Size.height(15),  
  },  
});