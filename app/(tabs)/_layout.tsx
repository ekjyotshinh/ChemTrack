import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// TabBarIcon component for displaying icons in the bottom tabs
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
          title: 'Scan QR Code',
          tabBarIcon: ({ color }) => <TabBarIcon name="qrcode" color={color} />,
        }}
      />

      {/* View Chemical Tab */}
      <Tabs.Screen
        name="viewChemicals"
        options={{
          title: 'View Chemical',
          tabBarIcon: ({ color }) => <TabBarIcon name="eye" color={color} />,
        }}
      />

      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="info-circle"
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />

      {/* Add Chemical Tab */}
      <Tabs.Screen
        name="addChemical"
        options={{
          title: 'Add Chemical',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-circle" color={color} />,
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
