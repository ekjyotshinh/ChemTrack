import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router'; 
import CustomButton from '@/components/CustomButton'; 

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
        width={80} 
        icon={
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="icon icon-tabler icons-tabler-outline icon-tabler-qrcode"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
            <path d="M7 17l0 .01" />
            <path d="M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
            <path d="M7 7l0 .01" />
            <path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
            <path d="M17 7l0 .01" />
            <path d="M14 14l3 0" />
            <path d="M20 14l0 .01" />
            <path d="M14 14l0 3" />
            <path d="M14 20l3 0" />
            <path d="M17 17l3 0" />
            <path d="M20 17l0 3" />
          </svg>
        } 
        iconPosition='left'
      />
      <CustomButton 
        title="View Chemicals" 
        color="#4285F4" 
        onPress={() => router.push('/viewChemicals')}
        width={80} 
        icon={    
          <svg 
            xmlns="http://www.w3.org/2000/svg"  
            width="24"  
            height="24"  
            viewBox="0 0 24 24"  
            fill="none"  
            stroke="white" 
            strokeWidth="2"  
            strokeLinecap="round"  
            strokeLinejoin="round"  
            className="icon icon-tabler icons-tabler-outline icon-tabler-eye"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
            <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
          </svg>
        } 
        iconPosition="left" 
      />
      <CustomButton 
        title="Add Chemical" 
        color="#4285F4" 
        onPress={() => router.push('/addChemical')} 
        width={80} 
        icon={    
          <svg 
            xmlns="http://www.w3.org/2000/svg"  
            width="24"  
            height="24"  
            viewBox="0 0 24 24"  
            fill="none"  
            stroke="white"
            strokeWidth="2"  
            strokeLinecap="round"  
            strokeLinejoin="round"  
            className="icon icon-tabler icons-tabler-outline icon-tabler-plus"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 5l0 14" />
            <path d="M5 12l14 0" />
          </svg>
        } 
        iconPosition="left" 
      />
      <CustomButton 
        title="My Account" 
        color="#4285F4" 
        onPress={() => router.push('/profile')} 
        width={80} 
        icon={
          <svg 
            xmlns="http://www.w3.org/2000/svg"  
            width="24"  
            height="24"  
            viewBox="0 0 24 24"  
            fill="none"  
            stroke="white" 
            strokeWidth="2"  
            strokeLinecap="round"  
            strokeLinejoin="round"  
            className="icon icon-tabler icons-tabler-outline icon-tabler-user"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
          </svg>
        } 
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
    paddingTop: 40, // Add padding to the top for spacing
  },
  textContainer: {
    alignItems: 'flex-start', // Align texts to the left
    marginBottom: 40, // Add some space below the texts
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
