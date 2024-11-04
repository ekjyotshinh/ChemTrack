import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router'; 
import CustomButton from '@/components/CustomButton'; 
import Svg, { Path } from 'react-native-svg'; 
import QRCodeIcon from '@/assets/icons/QRCodeIcon'; 
import UserIcon from '@/assets/icons/UserIcon'; 
import PlusIcon from '@/assets/icons/PlusIcon'; 
import EyeIcon from '@/assets/icons/EyeIcon'; 

export default function HomePageView() {
  const router = useRouter(); // Initialize the router

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.usernameText}>Dummy Name</Text>
      </View>

      {/* Button Section */}
      <CustomButton 
        title="Scan QR Code" 
        color="#4285F4" 
        onPress={() => router.push('/scanQRCode')} 
        width={82.6} 
        icon={<QRCodeIcon width={24} height={24} />}
        iconPosition='left'
      />
      <CustomButton 
        title="View Chemicals" 
        color="#4285F4" 
        onPress={() => router.push('/viewChemicals')} 
        width={82.6}
        icon = {<EyeIcon width={24} height={24} />}
        iconPosition="left"
      />
      <CustomButton 
        title="Add Chemical" 
        color="#4285F4" 
        onPress={() => router.push('/addChemical')} 
        width={82.6} 
        icon = {<PlusIcon width={24} height={24} />}
        iconPosition="left" 
      />
      <CustomButton 
        title="My Account" 
        color="#4285F4" 
        onPress={() => router.push('/profile/profile')} 
        width={82.6} 
        icon={<UserIcon width = {24} height = {24}/>} 
        iconPosition="left" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', 
    backgroundColor: '#F5F5F5', 
    paddingLeft: '10%', 
    paddingTop: 40, 
  },
  textContainer: {
    alignItems: 'flex-start', 
    marginBottom: 40, 
  },
  welcomeText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#4285F4', 
    marginBottom: 10,
  },
  usernameText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black', 
    marginBottom: 20,
  },
});
