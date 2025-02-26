import { StyleSheet, Text, View, Alert } from 'react-native';
import { useRouter } from 'expo-router'; 
import CustomButton from '@/components/CustomButton'; 
import QRCodeIcon from '@/assets/icons/QRCodeIcon'; 
import UserIcon from '@/assets/icons/UserIcon'; 
import PlusIcon from '@/assets/icons/PlusIcon'; 
import EyeIcon from '@/assets/icons/EyeIcon'; 
import Colors from '@/constants/Colors';
import TextInter from '@/components/TextInter';
import { useUser } from '@/contexts/UserContext'; // import the hook to get user info
import * as Linking from 'expo-linking';


export default function HomePageView() {
  const router = useRouter(); // Initialize the router
  const { userInfo } = useUser(); // Get the username from context

  // Function to test deep linking - delete once the testing is done
  const testDeepLink = async () => {
    const deepLink = "http://localhost:8081/signup?email=deepajay0713@gmail.com&userType=Admin";

    try {
      const supported = await Linking.canOpenURL(deepLink);
      console.log("Deep Link Supported:", supported);

      if (supported) {
        await Linking.openURL(deepLink);
      } else {
        Alert.alert("Error", "Deep linking is not supported on this device.");
      }
    } catch (error) {
      console.error("Deep Link Error:", error);
      Alert.alert("Error", "An error occurred while testing the deep link.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <TextInter style={styles.welcomeText}>Welcome,</TextInter>
        <TextInter style={styles.usernameText}>
          {/* Check if userInfo and userInfo.name are valid */}
          {userInfo && userInfo.name ? userInfo.name : 'Temp Name'}
        </TextInter>
      </View>

      {/* Button Section */}
      <CustomButton 
        title="Scan QR Code" 
        onPress={() => router.push('/scanQRCode')} 
        width={337} 
        icon={<QRCodeIcon width={24} height={24} />}
        iconPosition='left'
      />
      <CustomButton 
        title="View Chemicals" 
        onPress={() => router.push('/viewChemicals')} 
        width={337}
        icon = {<EyeIcon width={24} height={24} />}
        iconPosition="left"
      />
      <CustomButton 
        title="Add Chemical" 
        onPress={() => router.push('/addChemical')} 
        width={337} 
        icon = {<PlusIcon width={24} height={24} />}
        iconPosition="left" 
      />
      <CustomButton 
        title="My Account" 
        onPress={() => router.push('/profile/profile')} 
        width={337} 
        icon={<UserIcon width = {24} height = {24}/>} 
        iconPosition="left" 
      />
      <CustomButton 
        title="Only for testing purpose" 
        onPress={() => router.push('/checkDownload')} 
        width={337} 
        icon={<QRCodeIcon width={24} height={24} />}
        iconPosition='left'
      />
      {/* Test Deep Link Button - for testing purposes only */}
      <CustomButton 
        title="Test Deep Link" 
        onPress={testDeepLink} 
        width={337} 
        icon={<UserIcon width={24} height={24} />}
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
    color: Colors.blue, 
    marginBottom: 10,
  },
  usernameText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black', 
    marginBottom: 20,
  },
});
