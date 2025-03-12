import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/contexts/UserContext';
import BlueHeader from '@/components/BlueHeader';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import Size from '@/constants/Size';
import CustomButton from '@/components/CustomButton';
import Colors from '@/constants/Colors';

export default function customSignup2() {
  const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;
  const router = useRouter();
  const { email, password, userType, school, isAdmin, isMaster } = useLocalSearchParams();

  const emailValue = Array.isArray(email) ? email[0] : email;
  const passwordValue = Array.isArray(password) ? password[0] : password;
  const userTypeValue = Array.isArray(userType) ? userType[0] : userType;
  const schoolValue = Array.isArray(school) ? school[0] : school;

  // Convert string "true"/"false" to boolean
  const isAdminValue = isAdmin === 'true';
  const isMasterValue = isMaster === 'true';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { updateUserInfo } = useUser();

  const handleCreateAccountPress = async () => {
    const url = `${API_URL}/api/v1/users`;
    const userData = {
      first: firstName,
      last: lastName,
      email: emailValue,
      password: passwordValue,
      school: schoolValue,
      userType: userTypeValue,
      is_admin: isAdminValue,
      is_master: isMasterValue,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        const data = await res.json();
        updateUserInfo({
			name: `${firstName} ${lastName}`,
			email: emailValue,
			is_admin: isAdminValue,
			is_master: isMasterValue,
			school: schoolValue,
			id: data.user.id,
			allow_email: data.user.allow_email ?? false, 
			allow_push: data.user.allow_push ?? false, 
		});
		  
        router.replace('/(tabs)');
      } else {
        Alert.alert("Error creating account!");
      }
    } catch (error) {
      Alert.alert("Error creating account!");
    }
  };

  const handleBackPress = () => {
    router.push('/customSignup1');
  };

  return (
    <View style={styles.container}>
      <BlueHeader headerText={'Sign Up'} onPress={handleBackPress} />
      <ScrollView style={{ width: '100%' }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ height: Size.height(15) }} />
          <View style={styles.formContainer}>
            <HeaderTextInput
              value={firstName}
              onChangeText={setFirstName}
              headerText={'First Name'}
              hasIcon={true}
            />
            <View style={{ height: Size.height(10) }} />
            <HeaderTextInput
              value={lastName}
              onChangeText={setLastName}
              headerText={'Last Name'}
              hasIcon={true}
            />
          </View>
          <View style={{ height: Size.height(250) }} />
          <CustomButton
            iconPosition='right'
            title='Create Account'
            color={(firstName && lastName) ? Colors.blue : Colors.white}
            textColor={(firstName && lastName) ? Colors.white : Colors.grey}
            icon={<Ionicons name="checkmark" size={24} color={(firstName && lastName) ? Colors.white : Colors.grey} />}
            onPress={handleCreateAccountPress}
            width={337}
          />
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#F5F5F5' },
	formContainer: { flex: 1, paddingHorizontal: Size.width(33), marginTop: Size.width(120), width: '100%' },
  });