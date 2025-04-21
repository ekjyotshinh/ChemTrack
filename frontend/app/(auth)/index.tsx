import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import TextInter from '@/components/TextInter';
import Size from '@/constants/Size';
import Colors from '@/constants/Colors';

export default function StartPage() {
  const router = useRouter();


  useEffect(() => {
      const handleDeepLink = (event: { url: string }) => {
          console.log("Received deep link:", event.url);
          let { path, queryParams } = Linking.parse(event.url);

          if (path === 'signup' && queryParams?.email) {
              router.push({
                  pathname: '/signupPage1',
                  params: { email: queryParams.email, userType: queryParams.userType },
              });
          }
      };

      const subscription = Linking.addEventListener('url', handleDeepLink);

      return () => {
          subscription.remove();
      };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={{ width: '100%' }}>
        <View style={styles.innerContainer}>
          <View style={{ alignSelf: 'center' }}>
            <TextInter style={[styles.brand, styles.blue]}>
              Chem<TextInter style={[styles.brand, styles.black]}>Track</TextInter>
            </TextInter>
          </View>
          <TextInter style={styles.subtitle}>
            <TextInter style={styles.black}>A </TextInter>
            <TextInter style={styles.blue}>chemical inventory manager </TextInter>
            <TextInter style={styles.black}>with QR code scanning </TextInter>
            <TextInter style={styles.blue}>built for schools.</TextInter>
          </TextInter>



          <View style={{ height: Size.height(90) }} />

          {/* Link to login page */}
          <TextInter onPress={() => router.push('/login')} style={styles.link}>
            Already have an account? Log In
          </TextInter>

          {/* Link to sign-up page */}
          <TextInter onPress={() => router.push('/signupPage1')} style={styles.link}>
            Don't have an account? Sign-up
          </TextInter>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  black: { color: Colors.black, fontWeight: 'bold' },
  blue: { color: Colors.blue, fontWeight: 'bold' },
  container: {
    flex: 1,
    backgroundColor: Colors.offwhite,
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerContainer: {
    marginTop: Size.height(110),
    marginHorizontal: Size.width(33),
    alignItems: 'center',
  },
  brand: { fontSize: 55, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: Colors.black, marginBottom: 30, textAlign: 'center' },
  link: { marginTop: 15, color: 'blue', textAlign: 'center', fontWeight: 'bold' },
});
