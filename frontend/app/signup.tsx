import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton'; 

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const router = useRouter();

  const handleSignup = () => {
    Alert.alert('Signup successful');
    router.push('/login'); 
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.brand, styles.blue]}>
        Chem<Text style={styles.black}>Track</Text>
      </Text>
      <Text style={styles.subtitle}>
        <Text style={styles.black}>A</Text>{' '}
        <Text style={styles.blue}>chemical inventory manager</Text>{' '}
        <Text style={styles.black}>with QR code scanning </Text>{' '}
        <Text style={styles.blue}>built for schools.</Text>
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={styles.label}>School</Text>
      <TextInput
        style={styles.input}
        placeholder="School"
        value={school}
        onChangeText={setSchool}
      />
      
      {/* Use CustomButton for the signup button */}
      <CustomButton title="Next" onPress={handleSignup} width={70} />

      {/* Link to the login page */}
      <Text onPress={() => router.push('/login')} style={styles.link}>
        Already have an account? Log In
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  black: { color: '#000' },
  blue: { color: '#007BFF' },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',  // Center horizontally
    padding: 20,
    marginLeft: '10%',
    marginRight: '10%'
  },
  brand: { fontSize: 60, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: 'gray', marginBottom: 30, textAlign: 'center' },
  label: {
    alignSelf: 'flex-start', 
    marginBottom: 5,        
    color: '#000',         
    fontWeight: 'bold',     
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    width: '100%', 
  },
  link: { marginTop: 15, color: 'blue', textAlign: 'center', fontWeight: 'bold' },
});
