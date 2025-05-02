import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { API_URL } from '@/constants/API';

// Configure how notifications are presented when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationToken {
  deviceToken: string;
  deviceType: string;
  deviceName: string;
}

async function registerForPushNotifications(): Promise<NotificationToken | null> {
  let token;

  // Check if it's a physical device (notifications won't work in simulator)
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // If no existing permission, request it
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // If still no permission, exit
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return null;
  }

  // Get the token
  token = (await Notifications.getExpoPushTokenAsync({
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID, // Make sure this is set in your env
  })).data;

  // Set up special channel for Android
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Return device information
  return {
    deviceToken: token,
    deviceType: Platform.OS,
    deviceName: Device.modelName || 'Unknown Device',
  };
}

// Function to handle notification responses
function setNotificationHandler(handler: (response: Notifications.NotificationResponse) => void) {
  return Notifications.addNotificationResponseReceivedListener(handler);
}

// Function to handle received notifications
function setNotificationReceiver(handler: (notification: Notifications.Notification) => void) {
  return Notifications.addNotificationReceivedListener(handler);
}

// Store for temporary device tokens (replace with DB storage later)
let deviceTokens: NotificationToken[] = [];

async function storeDeviceToken(token: NotificationToken, userId: string) {
  // Check if token already exists
  const existingTokenIndex = deviceTokens.findIndex(t => t.deviceToken === token.deviceToken);
  if (existingTokenIndex >= 0) {
    deviceTokens[existingTokenIndex] = token;
  } else {
    deviceTokens.push(token);
  }
  console.log('Stored device tokens:', deviceTokens);
  try {
    const response = await fetch(`${API_URL}/api/v1/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expo_push_token: token.deviceToken,
      }),
    });

    if (!response.ok) {
      return false
    }

    console.log('User preferences updated successfully');
    return true
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return false
  }
}

function getStoredDeviceTokens(): NotificationToken[] {
  return deviceTokens;
}

function removeDeviceToken() {
  deviceTokens = [];
  console.log('Updated device tokens:', deviceTokens);
}

export {
  NotificationToken,
  registerForPushNotifications,
  setNotificationHandler,
  setNotificationReceiver,
  storeDeviceToken,
  getStoredDeviceTokens,
  removeDeviceToken
};
