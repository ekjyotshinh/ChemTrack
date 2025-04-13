// Toekn generation and  authentication screen
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
      console.log(`Sending request to ${API_URL}/api/v1/auth/forgot-password`);
      const response = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }); 

      const data = await response.json(); 
      console.log('Response data:', data);

      if (response.ok) { 
        Alert.alert('Email Sent', 'Check your email for reset instructions.', [{ text: 'OK', onPress: () => setInputToken(true) }]);
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

  const [manualToken, setManualToken] = useState('');
  const [inputToken, setInputToken] = useState(false);

  const handleManualToken = async () => {
    if (manualToken.length > 0) {
      const trimmedToken = manualToken.trim();
      
      // Basic validation - ensure it's a 64-character hex string
      const isValidTokenFormat = /^[a-f0-9]{64}$/i.test(trimmedToken);
      
      if (!isValidTokenFormat) {
        Alert.alert(
          "Invalid Token Format",
          "The token you entered doesn't match the expected format. Please check your email and enter the exact token provided.",
          [{ text: 'OK' }]
        );
        return;
      }
      
      setIsLoading(true);
      
      try {
        console.log("Verifying token with server:", trimmedToken);
        
        const response = await fetch(`${API_URL}/api/v1/auth/verify-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: trimmedToken
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Token is valid, proceed to password reset
          console.log("Token verified successfully");
          router.push({
            pathname: "/(auth)/forgotPassword",
            params: { token: trimmedToken }
          });
        } else {
          // Token is invalid
          console.log("Token verification failed:", data.error);
          Alert.alert('Invalid Token', data.error || 'The reset token is not valid or has expired. Please check your email or request a new reset link.');
        }
      } catch (error) {
        console.error("Token verification error:", error);
        Alert.alert(
          "Verification Error",
          "Could not verify the reset token. Please try again or request a new reset link."
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please enter a reset token.');
    }
  };

  return (  
    <View style={styles.container}>  
      <BlueHeader headerText={'Reset Password'} onPress={() => router.push('/login')} />  

      <ScrollView style={styles.scrollContainer}>  
        <View style={{ marginTop: Size.height(40) }}>  
          <TextInter style={styles.descriptionText}>  
            Enter your email address and we'll send you instructions to reset your password.  
          </TextInter> 
          {!inputToken && ( 
          <View style={{ alignItems: 'center', marginTop: Size.height(30) }}>  
            <HeaderTextInput  
              onChangeText={setEmail}  
              headerText={'Email'}  
              value={email}  
              hasIcon={true}  
              inputWidth={Size.width(340)}  
              keyboardType='email-address'  
              autoCapitalize='none'  
              autoCorrect={false}
            />  
          </View>  
          )}
          {!inputToken && (
          <View style={styles.buttonContainer}>  
            <CustomButton  
              title={isLoading ? "Sending..." : "Send Reset Link"}  
              color={isValidEmail ? Colors.blue : Colors.white}
              textColor={isValidEmail ? Colors.white : Colors.grey}  
              onPress={handleResetPassword}  
              width={327}  
              icon={<LoginIcon width={24} height={24} color={isValidEmail ? Colors.white : Colors.grey} />}  
              iconPosition='left'
            />
            <TextInter 
              onPress= {() => setInputToken(true) }
              style={styles.enterTokenText}
            >
              Click to enter Token
            </TextInter>

          </View>  
          )}

          {inputToken && (
            <View style={{ alignItems: 'center', marginTop: Size.height(15) }}>
              <HeaderTextInput
                onChangeText={setManualToken}
                headerText={'Reset Token'}
                value={manualToken}
                hasIcon={true}
                inputWidth={Size.width(340)}
                autoCapitalize='none'
                autoCorrect={false}
              />
              <CustomButton
                title="Use Token"
                color={manualToken.length > 0 ? Colors.blue : Colors.white}
                textColor={manualToken.length > 0 ? Colors.white : Colors.grey}
                onPress={handleManualToken}
                width={360}
                icon={<LoginIcon width={24} height={24} color={manualToken.length > 0 ? Colors.white : Colors.grey} />}
                iconPosition='left'
              />
            </View>
          )}
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 327,
    marginTop: Size.height(15),
  },
    enterTokenText: { 
    alignSelf: 'center', 
    marginTop: 10, 
    color: Colors.blue, 
    fontSize: 14,
    fontWeight: '600', // Make it slightly bolder
    padding: 5, // Add some padding to create a larger touch target
  },
});