import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (email === 'dummy@dummy.com' && password === 'pass123') {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Invalid credentials');
    }
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

      {/* CustomButton with the same width as the input */}
      <CustomButton title="Log In" onPress={handleLogin} width={70} 
      icon = {<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="white"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-login"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M21 12h-13l3 -3" /><path d="M11 15l-3 -3" /></svg>}
      />
        {/* Link to the login page */}
      <Text onPress={() => router.push('/signup')} style={styles.link}>
        Don't have an account? Sign-up
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
