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
import Loader from '@/components/Loader';
import { API_URL } from '@/constants/API';

export default function customSignup2() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id, password} = useLocalSearchParams();

  const passwordValue = Array.isArray(password) ? password[0] : password;
  const userId = Array.isArray(id) ? id[0] : id;


  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { updateUserInfo,userInfo } = useUser();
// on create an account we are not creating an account but rather updating the user info for the already created account
  const handleCreateAccountPress = async () => {
    const url = `${API_URL}/api/v1/users/${userId}`;
    const userData = {
      first: firstName,
      last: lastName,
      password: passwordValue,
    };
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        setLoading(false); // Stop loader
        const data = await res.json();
        updateUserInfo({
		    	name: `${firstName} ${lastName}`,
		    	email: userInfo.email,
		    	is_admin: userInfo.is_admin,
		    	is_master: userInfo.is_master,
		    	school: userInfo.school,
		    	id: userInfo.id,
		    	allow_email:false, 
		    	allow_push:false, 
		    });
		  
        router.replace('/(tabs)');
      } else {
        setLoading(false); // Stop loader
        Alert.alert("Error creating account!");
      }
    } catch (error) {
      setLoading(false); // Stop loader
      Alert.alert("Error creating account!");
    }
  };

  const handleBackPress = () => {
      router.push({
        pathname: '/customSignup1',
        params: { 
          id: userId,
        },
      });
  };

  return (
    <View style={styles.container}>
      <Loader visible={loading} message="Creating Account..." />
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
            onPress={(firstName && lastName) ? handleCreateAccountPress : () => {}}
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