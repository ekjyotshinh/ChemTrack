import React, { useState } from 'react';  
import { View, ScrollView, Alert, StyleSheet } from 'react-native';  
import { useRouter } from 'expo-router';  
import CustomButton from '@/components/CustomButton';  
import Colors from '@/constants/Colors';  
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';  
import Size from '@/constants/Size';  
import TextInter from '@/components/TextInter';  
import BlueHeader from '@/components/BlueHeader';  

export default function NewPassword() {  
  const router = useRouter();  
  const [newPassword, setNewPassword] = useState('');  
  const [confirmPassword, setConfirmPassword] = useState('');  

  const handleChangePassword = async () => {  
    // Validate inputs  
    if (!newPassword || !confirmPassword) {  
      Alert.alert('Error', 'Please fill in all fields.');  
      return;  
    }  

    if (newPassword !== confirmPassword) {  
      Alert.alert('Error', 'Passwords do not match.');  
      return;  
    }  

    try {  
      // Send request to update the password  
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/users/update-password`, {  
        method: 'PUT',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify({  
          new_password: newPassword, // The new password entered by the user  
        }),  
      });  

      if (!response.ok) throw new Error('Failed to update password');  

      // Success alert  
      Alert.alert('Success', 'Password changed successfully.', [  
        { text: 'OK', onPress: () => router.push('/profile/profile') },  
      ]);  

      // Clear password fields  
      setNewPassword('');  
      setConfirmPassword('');  
    } catch (error) {  
      Alert.alert('Error', 'Failed to update your password. Please try again.');  
      console.error(error);  
    }  
  };  

  return (  
    <View style={styles.container}>  
      {/* Header */}  
      <BlueHeader headerText="New Password" onPress={() => router.push('/profile/profile')} />  

      <ScrollView style={styles.scrollContainer}>  
        <View style={{ marginTop: Size.height(40) }}>  
          <TextInter style={styles.descriptionText}>  
            Enter your new password below to update your account password.  
          </TextInter>  

          <View style={{ alignItems: 'center', marginTop: Size.height(30) }}>  
            {/* Input for New Password */}  
            <HeaderTextInput  
              onChangeText={(text) => setNewPassword(text)}  
              headerText="New Password"  
              value={newPassword}  
              hasIcon={false}  
              inputWidth={Size.width(340)}  
              secureTextEntry={true}  
              autoCapitalize="none"  
            />  

            {/* Input for Confirm New Password */}  
            <HeaderTextInput  
              onChangeText={(text) => setConfirmPassword(text)}  
              headerText="Confirm New Password"  
              value={confirmPassword}  
              hasIcon={false}  
              inputWidth={Size.width(340)}  
              secureTextEntry={true}  
              autoCapitalize="none"  
            />  
          </View>  

          {/* Button to Change Password */}  
          <View style={styles.buttonContainer}>  
            <CustomButton  
              title="Change Password"  
              color={newPassword && confirmPassword ? Colors.blue : Colors.white}  
              textColor={newPassword && confirmPassword ? Colors.white : Colors.grey}  
              onPress={handleChangePassword}  
              width={337}  
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