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
import { useUser } from '@/contexts/UserContext';

// TabBarIcon component for displaying icons in the bottom tabs
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const isAndroid = Platform.OS === 'android'
  const { userInfo } = useUser()
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
      {/* If the user is admin or master, show all tabs */}
      {[...(userInfo && (userInfo.is_admin || userInfo.is_master) ? [
        <Tabs.Screen
          key={0}
          name="scanQRCode"
          options={{
            title: 'Scan',
            tabBarIcon: ({ focused }) => (
              <NavScan
                color={focused ? 'black' : 'white'}
              />
            ),
          }}
        />,

        <Tabs.Screen
          key={1}
          name="viewChemicals"
          options={{
            title: 'View',
            tabBarIcon: ({ focused }) => (
              <NavView
                color={focused ? 'black' : 'white'}
              />
            ),
          }}
        />,

        <Tabs.Screen
          key={2}
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <NavHome
                color={focused ? 'black' : 'white'}
              />
            ),
          }}
        />,

        <Tabs.Screen
          key={3}
          name="addChemical"
          options={{
            title: 'Add',
            tabBarIcon: ({ focused }) => (
              <NavAdd
                color={focused ? 'black' : 'white'}
              />
            ),
          }}
        />,

        <Tabs.Screen
          key={4}
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

      ] : [
        // If the user is not admin or master, hide the Add Chemical tab and reorder
        <Tabs.Screen
          key={0}
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <NavHome
                color={focused ? 'black' : 'white'}
              />
            ),
          }}
        />,

        <Tabs.Screen
          key={1}
          name="scanQRCode"
          options={{
            title: 'Scan',
            tabBarIcon: ({ focused }) => (
              <NavScan
                color={focused ? 'black' : 'white'}
              />
            ),
          }}
        />,

        <Tabs.Screen
          key={2}
          name="viewChemicals"
          options={{
            href: null,
          }}
        />,

        <Tabs.Screen
          key={3}
          name="profile/profile"
          options={{
            title: 'Account',
            tabBarIcon: ({ focused }) => (
              <NavProfile
                color={focused ? 'black' : 'white'}
              />
            ),
          }}
        />,

        <Tabs.Screen
          key={4}
          name="addChemical"
          options={{
            href: null,
          }}
        />,
      ])
      ]}

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

      {/* Hidden Notifications Tab */}
      <Tabs.Screen
        name="profile/notifications"
        options={{
          href: null,
        }}
      />

      {/* Hidden testing Tab */}
      <Tabs.Screen
        name="checkDownload"
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

      {/* newPassword Tab */}
      <Tabs.Screen
        name="profile/newPassword"
        options={{
          href: null,
        }}
      />

      {/* Hidden Error/Unauthorized Tab */}
      <Tabs.Screen
        name="errorPage"
        options={{
          href: null,
        }}
      />
            {/* Hidden Error/Unauthorized Tab */}
      <Tabs.Screen
        name="fileViewer"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
