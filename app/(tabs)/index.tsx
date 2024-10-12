import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router'; 
import CustomButton from '@/components/CustomButton'; 

export default function HomePageView() {
  const router = useRouter(); // Initialize the router

  return (
    <View style={styles.container}>

      <Text style={styles.welcomeText}>Welcome,</Text>
      <Text style={styles.usernameText}>Dummy Name</Text>

      {/* Button Section */}
      <CustomButton 
        title="Scan QR Code" 
        color="#4285F4" 
        onPress={() => router.push('/scanQRCode')} 
      />
      <CustomButton 
        title="View Chemicals" 
        color="#4285F4" 
        onPress={() => router.push('/viewChemicals')}
      />
      <CustomButton 
        title="Add Chemical" 
        color="#4285F4" 
        onPress={() => router.push('/addChemical')} 
      />
      <CustomButton 
        title="My Account" 
        color="#4285F4" 
        onPress={() => router.push('/profile')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', 
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4285F4', 
    marginBottom: 5,
  },
  usernameText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black', 
    marginBottom: 40,
  },
});
