import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import QRCodeIcon from '@/assets/icons/QRCodeIcon'; 
import UserIcon from '@/assets/icons/UserIcon'; 
import PlusIcon from '@/assets/icons/PlusIcon'; 
import EyeIcon from '@/assets/icons/EyeIcon'; 
import HomeIcon from '@/assets/icons/HomeIcon'; 

// TabBarIcon component for displaying icons in the bottom tabs
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tabBarStyle = {
    backgroundColor: colorScheme === 'dark' ? '#333' : '#4285F4',
  };
  const activeTintColor = colorScheme === 'dark' ? 'black' : 'black';
  const inactiveTintColor = colorScheme === 'dark' ? '#ccc' : 'white';

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#4285F4', 
        },
        tabBarActiveTintColor: 'black', 
        tabBarInactiveTintColor: 'white', 
        headerShown: useClientOnlyValue(false, true),
      }}
    >

      {/* Scan QR Code Tab */}
      <Tabs.Screen
        name="scanQRCode"
        options={{
          title: 'Scan',
          tabBarIcon: ({ focused }) => (
            <QRCodeIcon
              width={48}
              height={45}
              color={focused ? 'black' : 'white'}
            />
          ),
        }}
      />

      {/* View Chemical Tab */}
      <Tabs.Screen
        name="viewChemicals"
        options={{
          title: 'View',
          tabBarIcon: ({ focused }) => (
            <EyeIcon
              width={51}
              height={58}
              color={focused ? 'black' : 'white'}
            />
          ),
        }}
      />

      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              width={40}
              height={40}
              color={focused ? 'black' : 'white'}
            />
          ),
        }}
      />

      {/* Add Chemical Tab */}
      <Tabs.Screen
        name="addChemical"
        options={{
          title: 'Add',
          tabBarIcon: ({ focused }) => (
            <PlusIcon
              width={50}
              height={50}
              color={focused ? 'black' : 'white'}
            />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile/profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => (
            <UserIcon
              width={42}
              height={39}
              color={focused ? 'black' : 'white'}
            />
          ),
        }}
      />

      {/* Hidden User Page Tab */}
      <Tabs.Screen
        name="profile/userPage"
        options={{
          title: 'User Page',
          tabBarButton: () => null, // This hides the tab from the bottom navigation
        }}
      />
    </Tabs>
  );
}
