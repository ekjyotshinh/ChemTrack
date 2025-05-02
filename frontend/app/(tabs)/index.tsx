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
import Size from '@/constants/Size';

export default function HomePageView() {
  const router = useRouter(); // Initialize the router
  const { userInfo } = useUser(); // Get the username from context

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
        icon={<EyeIcon width={24} height={24} />}
        iconPosition="left"
      />
      {userInfo && (userInfo.is_admin || userInfo.is_master) && (
        <CustomButton
          title="Add Chemical"
          onPress={() => router.push('/addChemical')}
          width={337}
          icon={<PlusIcon width={24} height={24} />}
          iconPosition="left"
        />)}
      <CustomButton
        title="My Account"
        onPress={() => router.push('/profile/profile')}
        width={337}
        icon={<UserIcon width={24} height={24} />}
        iconPosition="left"
      />

      <View style={{ height: Size.height(65) }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.offwhite,
    paddingHorizontal: Size.width(33),
    
  },
  textContainer: {
    alignSelf: 'flex-start',
    marginBottom: Size.height(60),
  },
  welcomeText: {
    fontSize: Size.width(50),
    fontWeight: 'bold',
    color: Colors.blue,
  },
  usernameText: {
    fontSize: Size.width(40),
    fontWeight: 'bold',
    color: Colors.black,
  },
});
