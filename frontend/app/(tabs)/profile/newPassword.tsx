import React, { useState, useEffect } from 'react';  
import { View, ScrollView, Alert, StyleSheet } from 'react-native';  
import { useRouter } from 'expo-router';  
import CustomButton from '@/components/CustomButton';  
import Colors from '@/constants/Colors';  
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';  
import Size from '@/constants/Size';  
import TextInter from '@/components/TextInter';  
import BlueHeader from '@/components/BlueHeader';  
import { useUser } from '@/contexts/UserContext';  
import ResetIcon from '@/assets/icons/ResetIcon';

export default function NewPassword() {  
  const router = useRouter();  
  const { userInfo } = useUser();  
  const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`; // Ensure your API_URL is configured correctly  

  const [newPassword, setNewPassword] = useState('');  
  const [confirmPassword, setConfirmPassword] = useState('');  

  const handleChangePassword = async () => {  
    
    if (!newPassword || !confirmPassword) {  
      Alert.alert('Error', 'Please fill in all fields.');  
      return;  
    }  

    if (newPassword !== confirmPassword) {  
      Alert.alert('Error', 'Passwords do not match.');  
      return;  
    }  

    // Change this later if we want more secure passwords
    // Making it at least 6 since Firebase by default uses at least 6 characters for passwords
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Passwords must be at least 6 characters');  
      return; 
    }

    try {  
      // Send a PUT request to update the user's password  
      const response = await fetch(`${API_URL}/api/v1/users/${userInfo.id}`, {  
        method: 'PUT',  
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({
          Password: newPassword,
          is_admin: userInfo.is_admin, // currently if these flags are not passed we set them to false
          is_master: userInfo.is_master, // currently if these flags are not passed we set them to false
          allow_email: userInfo.allow_email, // currently if these flags are not passed we set them to false
          allow_push: userInfo.allow_push, // currently if these flags are not passed we set them to false
        }), 

      });  

      if (!response.ok) throw new Error('Failed to update password');  

   
      Alert.alert(  
        'Success',  
        'Password changed successfully.',  
        [{ text: 'OK', onPress: () => router.push('/profile/profile') }]  
      );  

      // Clear password fields after successful update  
      setNewPassword('');  
      setConfirmPassword('');  
    } catch (error) {  
      Alert.alert('Error', 'Failed to update your password. Please try again.');  
      console.error(error);  
    }  
  };  

  const [isValidPassword, setIsValidPassword] = useState(false);

  // Use effect to manage isValidPassword, which determines the button's colors
  useEffect(() => {
    if ((newPassword && confirmPassword) && newPassword == confirmPassword && newPassword.length >= 6) {
      setIsValidPassword(true);
    } else {
      setIsValidPassword(false);
    }
  }, [newPassword, confirmPassword]);

  return (  
    <View style={styles.container}>  
      <BlueHeader headerText="Reset Password" onPress={() => router.push('/profile/profile')} />  

      <ScrollView style={styles.scrollContainer}>  
        <View style={{ marginTop: Size.height(40) }}>  
          <TextInter style={styles.descriptionText}>  
            Enter your new password below to update your account password.  
          </TextInter>  

          <View style={{ alignItems: 'center', marginTop: Size.height(30) }}>  
            <HeaderTextInput  
              testID="new-password-input"
              onChangeText={setNewPassword}  
              headerText="New Password"  
              value={newPassword}  
              hasIcon={true}  
              inputWidth={Size.width(340)}  
              secureTextEntry={true}  
              autoCapitalize="none"  
            />

            <View style={{ height: Size.height(25) }} /> 

            <HeaderTextInput  
              testID="confirm-password-input"
              onChangeText={setConfirmPassword}  
              headerText="Confirm New Password"  
              value={confirmPassword}  
              hasIcon={true}  
              inputWidth={Size.width(340)}  
              secureTextEntry={true}  
              autoCapitalize="none"  
            />  
          </View>  

          <View style={styles.buttonContainer}>  
            <CustomButton  
              title="Change Password"  
              color={isValidPassword ? Colors.blue : Colors.white}  
              textColor={isValidPassword ? Colors.white : Colors.grey}  
              onPress={handleChangePassword}  
              width={337}  
              icon={<ResetIcon width={24} height={24} color={isValidPassword ? Colors.white : Colors.grey} />}
              iconPosition='left'
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