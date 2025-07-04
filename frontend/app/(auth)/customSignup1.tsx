import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import Size from '@/constants/Size';
import Colors from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';
import BlueHeader from '@/components/BlueHeader';
import { useUser } from '@/contexts/UserContext';
import { API_URL } from '@/constants/API';

export default function CustomSignup1() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const userId = Array.isArray(id) ? id[0] : id;

  const [emailValue, setEmailValue] = useState('');
  const [password, setPassword] = useState('');
  const [schoolValue, setSchoolValue] = useState('');
  const [isMaster, setIsMaster] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { updateUserInfo, userInfo } = useUser();

  // Fetch user data
  useEffect(() => {
    if (!userId) return;
    //console.log("userId from URL:", userId);
    getUserData();
  }, [userId]);

  const getUserData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/users/${userId}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        //console.log(data);

        const { email, is_master, is_admin, school } = data;
        setEmailValue(email);
        setSchoolValue(school);
        setIsMaster(is_master);
        setIsAdmin(is_admin);
      } else {
        Alert.alert("Error fetching data");
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      Alert.alert("Error fetching data");
    }
  };
    
	//console.log("isMaster:", isMaster);
	//console.log("isAdmin:", isAdmin);

  const handleNextPress = () => {
    if (!userId) {
      Alert.alert('Invalid user ID');
      return;
    }

    updateUserInfo({
			name: '',
			email: emailValue,
			is_admin: isAdmin,
			is_master: isMaster,
			school: schoolValue,
			id: userId,
			allow_email: false, 
			allow_push: false, 
		});
    router.push({
      pathname: '/customSignup2',
      params: { 
        id: userId,
        password: password
      },
    });
  };

  const handleBackPress = () => {
    router.push('/login');
  };
 
  return (
    <View style={styles.container}>
      <BlueHeader headerText={'Sign Up'} onPress={handleBackPress} />
      <ScrollView style={{ width: '100%' }}>
        <View style={styles.formContainer}>
          {/* Email (Pre-filled and Disabled) */}
          <HeaderTextInput testID="emailInput" headerText={'Email'} value={emailValue} hasIcon={false} disabled={true} onChangeText={() => {}} editable={false} />

          <View style={{ height: Size.height(10) }} />

          {/* Password Input */}
          <HeaderTextInput testID="passwordInput" headerText={'Password'} value={password} onChangeText={setPassword} secureTextEntry hasIcon />

          <View style={{ height: Size.height(10) }} />

          {/* School (Pre-filled and Disabled) */}
          <HeaderTextInput testID="schoolInput" headerText={'School'} value={schoolValue} hasIcon={false} disabled={true} onChangeText={() => {}} editable={false} />

          <View style={{ height: Size.height(10) }} />

          {/* User Type (Pre-filled and Disabled) */}
          <HeaderTextInput testID="userTypeInput" headerText={'User Type'} value={isAdmin ? 'Admin' : 'Master'} hasIcon={false} disabled={true} onChangeText={() => {}} editable={false} />

          <View style={{ height: Size.height(250) }} />
          <CustomButton
            title='Next'
            color={password ? Colors.blue : Colors.white}
            textColor={password ? Colors.white : Colors.grey}
            icon={<Ionicons name="arrow-forward" size={24} color={password ? Colors.white : Colors.grey} />}
            onPress={password ? handleNextPress : () => {}}
            width={337}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offwhite, alignItems: 'center' },
  formContainer: { flex: 1, paddingHorizontal: Size.width(33), marginTop: Size.width(120), width: '100%' },
});
