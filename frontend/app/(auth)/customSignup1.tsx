import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import Size from '@/constants/Size';
import Colors from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';
import BlueHeader from '@/components/BlueHeader';

export default function customSignup1() {
  const router = useRouter();
  const { email, userType, school } = useLocalSearchParams();

  const emailValue = Array.isArray(email) ? email[0] : email;
  const userTypeValue = Array.isArray(userType) ? userType[0].toLowerCase() : userType?.toLowerCase();
  const schoolValue = Array.isArray(school) ? school[0] : school;

  const [password, setPassword] = useState('');

  // Dynamically set isMaster and isAdmin
  const isMaster = userTypeValue === 'master';
  const isAdmin = userTypeValue === 'admin';

  	console.log("userTypeValue:", userTypeValue); // Debugging
	console.log("isMaster:", isMaster);
	console.log("isAdmin:", isAdmin);

  const handleNextPress = () => {
    router.push({
      pathname: '/customSignup2',
      params: { 
        email: emailValue, 
        password, 
        userType: userTypeValue, 
        school: schoolValue,
        isMaster: isMaster ? "true" : "false",  // Convert boolean to string
      	isAdmin: isAdmin ? "true" : "false",    // Convert boolean to string
      },
    });
  };

  const handleBackPress = () => {
    router.push('/signupPage1');
  };
 
  return (
    <View style={styles.container}>
      <BlueHeader headerText={'Sign Up'} onPress={handleBackPress} />
      <ScrollView style={{ width: '100%' }}>
        <View style={styles.formContainer}>
          {/* Email (Pre-filled and Disabled) */}
          <HeaderTextInput headerText={'Email'} value={emailValue} hasIcon editable={false} onChangeText={() => {}} />

          <View style={{ height: Size.height(10) }} />

          {/* Password Input */}
          <HeaderTextInput headerText={'Password'} value={password} onChangeText={setPassword} secureTextEntry hasIcon />

          <View style={{ height: Size.height(10) }} />

          {/* School (Pre-filled and Disabled) */}
          <HeaderTextInput headerText={'School'} value={schoolValue} hasIcon editable={false} onChangeText={() => {}} />

          <View style={{ height: Size.height(10) }} />

          {/* User Type (Pre-filled and Disabled) */}
          <HeaderTextInput headerText={'User Type'} value={userTypeValue} hasIcon editable={false} onChangeText={() => {}} />

          <View style={{ height: Size.height(250) }} />
          <CustomButton
            title='Next'
            color={password ? Colors.blue : Colors.white}
            textColor={password ? Colors.white : Colors.grey}
			iconPosition="right"
            icon={<Ionicons name="arrow-forward" size={24} color={password ? Colors.white : Colors.grey} />}
            onPress={handleNextPress}
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
