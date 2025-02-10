import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import NavProfile from '@/assets/icons/navbar/NavProfile';
import NavAdd from '@/assets/icons/navbar/NavAdd';
import NavHome from '@/assets/icons/navbar/NavHome';
import NavView from '@/assets/icons/navbar/NavView';
import NavScan from '@/assets/icons/navbar/NavScan';
import { Platform } from 'react-native';

// TabBarIcon component for displaying icons in the bottom tabs
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const isAndroid = Platform.OS === 'android'

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.blue,
          paddingBottom: isAndroid ? 10 : 25,
          height: isAndroid ? 70 : 85,
          paddingTop: 10
        },

        tabBarActiveTintColor: 'black', 
        tabBarInactiveTintColor: 'white', 
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
    >

      {/* Scan QR Code Tab */}
      <Tabs.Screen
        name="scanQRCode"
        options={{
          title: 'Scan',
          tabBarIcon: ({ focused }) => (
            <NavScan
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
            <NavView
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
            <NavHome
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
            <NavAdd
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
            <NavProfile
              color={focused ? 'black' : 'white'}
            />
          ),
        }}
      />

      {/* Hidden User Page Tab */}
      <Tabs.Screen
        name="profile/userPage"
        options={{
          href: null,
        }}
      />

      {/* Hidden Reset Password Tab */}
      <Tabs.Screen
        name="profile/resetPassword"
        options={{
          href: null,
        }}
      />

      {/* Hidden Edit Chemical Tab*/}
      <Tabs.Screen
        name="editChemical"
        options={{
          href: null,
        }}
      />
      </Tabs>
  );
}
