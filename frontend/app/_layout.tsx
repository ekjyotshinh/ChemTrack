import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { UserProvider } from '@/contexts/UserContext';
import { AppState, Linking, StatusBar } from 'react-native';

import 'react-native-gesture-handler'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 

import { useColorScheme } from '@/components/useColorScheme';

import { 
  useFonts, 
  Inter_400Regular, 
  Inter_100Thin, 
  Inter_200ExtraLight, 
  Inter_300Light, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  Inter_800ExtraBold, 
  Inter_900Black 
} from '@expo-google-fonts/inter';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Re-apply dark status bar when tabbing back in
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setTranslucent(true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <UserProvider>
        <RootLayoutNav />
      </UserProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    // Function to handle deep links
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      console.log("Deep link received:", url);
      
      if (url.includes('reset-password')) {
        // Extract token from URL
        const tokenMatch = url.match(/token=([^&]+)/);
        if (tokenMatch && tokenMatch[1]) {
          const token = tokenMatch[1];
          console.log("Password reset token:", token);
          
          // Try multiple navigation approaches
          try {
            // Use a simple string approach for navigation
            console.log("Attempting to navigate with token:", token);
            router.push(`/(tabs)/profile/newPassword?token=${encodeURIComponent(token)}`);
          } catch (e) {
            console.error("First navigation attempt failed:", e);
            try {
              // Second approach
              router.push({
                pathname: "/(tabs)/profile/newPassword",
                params: { token }
              });
            } catch (e2) {
              console.error("Second navigation attempt failed:", e2);
              // Last resort approach
              setTimeout(() => {
                router.push(`/(tabs)/profile/newPassword?token=${encodeURIComponent(token)}`);
              }, 500);
            }
          }
        }
      }
    };
    
    // Add event listener for when the app is already open
    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Handle case where app was opened from a deep link
    const getInitialURL = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          console.log("App opened with URL:", initialUrl);
          handleDeepLink({ url: initialUrl });
        }
      } catch (e) {
        console.error("Error getting initial URL:", e);
      }
    };
    
    getInitialURL();
    
    // Clean up
    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}