import React, { useState } from 'react';  
import { View, ScrollView, Alert, StyleSheet } from 'react-native';  
import { useRouter } from 'expo-router';  
import CustomButton from '@/components/CustomButton';  
import Colors from '@/constants/Colors';  
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';  
import Size from '@/constants/Size';  
import TextInter from '@/components/TextInter';  
import BlueHeader from '@/components/BlueHeader';  

export default function ResetPassword() {  
  const router = useRouter();  
  const [newPassword, setNewPassword] = useState('');  
  const [confirmPassword, setConfirmPassword] = useState('');  

  const handleChangePassword = () => {  
    if (!newPassword || !confirmPassword) {  
      Alert.alert('Error', 'Please fill in all fields.');  
      return;  
    }  

    if (newPassword !== confirmPassword) {  
      Alert.alert('Error', 'Passwords do not match.');  
      return;  
    }  

     
    Alert.alert('Success', 'Password changed successfully.', [  
      { text: 'OK', onPress: () => router.push('/profile/profile') },  
    ]);  
  };  

  return (  
    <View style={styles.container}>  
      
      <BlueHeader headerText="Reset Password" onPress={() => router.push('/profile/profile')} />  
  
      <ScrollView style={styles.scrollContainer}>  
        <View style={{ marginTop: Size.height(40) }}>  
          <TextInter style={styles.descriptionText}>  
            Enter your new password below to reset your account password.  
          </TextInter>  

          <View style={{ alignItems: 'center', marginTop: Size.height(30) }}>  
            <HeaderTextInput  
              onChangeText={(text) => setNewPassword(text)}  
              headerText="New Password"  
              value={newPassword}  
              hasIcon={false}  
              inputWidth={Size.width(340)}  
              secureTextEntry={true}  
              autoCapitalize="none"  
            />  
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