import { useState, useEffect } from 'react';  
import { View, ScrollView, Alert, StyleSheet } from 'react-native';  
import { useRouter } from 'expo-router';  
import CustomButton from '@/components/CustomButton';  
import Colors from '@/constants/Colors';   
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';  
import Size from '@/constants/Size';  
import TextInter from '@/components/TextInter';  
import LoginIcon from '@/assets/icons/LoginIcon'; // You might want to use a different icon  
import BlueHeader from '@/components/BlueHeader';
import emailRegex from '@/functions/EmailRegex';

export default function ResetPassword() {  
  const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;
  const [email, setEmail] = useState('');
  
  const [isValidEmail, setIsValidEmail] = useState(false);
  emailRegex({ email, setIsValidEmail });
  
  const router = useRouter();  

  const handleResetPassword = async () => {
    if (!email || !isValidEmail) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    } 

    try {
      // Make the request to the backend to send an email
      const response = await fetch(`${API_URL}/api/v1/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Password Reset Request',
          body: 'Email sent successfully from the resent password screen. (TODO: figure out the logic, I think that if the user is logged in there should not be any need for this step. --> Maybe this screens should be at the login with some link like reset password)',
        }),
      }); 

      const data = await response.json(); 

      if (response.ok) {
        Alert.alert(
          'Success',
          'Email sent successfully. (TODO: figure out the logic, I think that if the user is logged in there should not be any need for this step.)',
          [{ text: 'OK', onPress: () => router.push('/profile/newPassword') }]
        );
      } else {
        Alert.alert('Error', data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };  

  const handleClear = (): void => {
    setEmail('');
  }


  return (  
    <View style={styles.container}>  
      <BlueHeader headerText={'Reset Password'} onPress={() => router.push('/profile/profile')} />  

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
              title="Send Reset Link"  
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