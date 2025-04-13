// user for updating password
import { useState, useEffect } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import Colors from '@/constants/Colors';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import Size from '@/constants/Size';
import TextInter from '@/components/TextInter';
import BlueHeader from '@/components/BlueHeader';
import LoginIcon from '@/assets/icons/LoginIcon';
import passwordRegex from '@/functions/PasswordRegex';

// Make sure this file is saved at the correct path: app/(auth)/forgotPassword.tsx
export default function ForgotPassword() {
  const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.token) {
      // Log token received from params
      console.log("Token received in forgotPassword:", params.token);
      setToken(params.token as string);
    } else {
      console.log("No token received in URL params");
    }
  }, [params]);
// Validate password - at least one uppercase, one lowercase, one number, and one special character
  passwordRegex({ password, setIsValidPassword });
  useEffect(() => {
    
    // Check if passwords match
    setPasswordsMatch(password === confirmPassword && password !== '');
  }, [password, confirmPassword]);

  const handleResetPassword = async () => {
    console.log("Attempting password reset with token:", token);
    //passwordRegex({ password, setIsValidPassword });
    if (!isValidPassword) {
      Alert.alert('Error', 'Password must be at least 8 characters and have at least one uppercase, one lowercase, one number, and one special character');
      return;
    }

    if (!passwordsMatch) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'Reset token is missing. Please request a new password reset.');
      console.log("No token available when attempting password reset");
      return;
    }
    
    console.log("Attempting password reset with token:", token);

    setIsLoading(true);

    try {
      console.log(`Sending request to ${API_URL}/api/v1/auth/reset-password`);
      const response = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        Alert.alert(
          'Success',
          'Your password has been reset successfully. PLease login with the newer password',
          [{ text: 'Login', onPress: () => router.push('/login') }]
        );
      } else {
        Alert.alert('Error', data.error || 'Failed to reset password. The token may be invalid or expired.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <BlueHeader headerText={'Set New Password'} onPress={() => router.push('/login')} />

      <ScrollView style={styles.scrollContainer}>
        <View style={{ marginTop: Size.height(40) }}>
          <TextInter style={styles.descriptionText}>
            Enter your new password below to reset your account password.
          </TextInter>

          <View style={styles.inputContainer}>
            <HeaderTextInput
              onChangeText={password => setPassword(password)}
              headerText={'New Password'}
              value={password}
              secureTextEntry={true}
              hasIcon={true}
              inputWidth={Size.width(340)}
              autoCapitalize='none'
              autoCorrect={false}
            />

            <HeaderTextInput
              onChangeText={password => setConfirmPassword(password)}
              headerText={'Confirm New Password'}
              value={confirmPassword}
              secureTextEntry={true}
              hasIcon={true}
              inputWidth={Size.width(340)}
              autoCapitalize='none'
              autoCorrect={false}
            />
          </View>

          {password.length > 0 && !isValidPassword && (
            <TextInter style={styles.warningText}>
              Password must be at least 8 characters and contain at least one uppercase, one lowercase, one number, and one special character.
            </TextInter>
          )}

          {confirmPassword.length > 0 && !passwordsMatch && (
            <TextInter style={styles.warningText}>
              Passwords do not match.
            </TextInter>
          )}

          <View style={styles.buttonContainer}>
            <CustomButton
              title={isLoading ? "Updating..." : "Reset Password"}
              color={(isValidPassword && passwordsMatch) ? Colors.blue : Colors.white}
              textColor={(isValidPassword && passwordsMatch) ? Colors.white : Colors.grey}
              onPress={handleResetPassword}
              width={360}
              icon={<LoginIcon width={24} height={24} color={(isValidPassword && passwordsMatch) ? Colors.white : Colors.grey} />}
              iconPosition='left'
              disabled={isLoading}
            />

            <CustomButton
              title="Cancel"
              onPress={handleCancel}
              color={Colors.red}
              textColor={Colors.white}
              width={360}
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
  inputContainer: {
    alignItems: 'center',
    marginTop: Size.height(20),
    gap: Size.height(20),
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: Size.height(40),
    gap: Size.height(15),
  },
  warningText: {
    fontSize: 14,
    color: Colors.red,
    textAlign: 'center',
    paddingHorizontal: Size.width(20),
    marginTop: Size.height(10),
  },
});