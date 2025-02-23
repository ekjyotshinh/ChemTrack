import BlueHeader from '@/components/BlueHeader'
import TextInter from '@/components/TextInter'
import Colors from '@/constants/Colors'
import Size from '@/constants/Size'
import { useRouter } from 'expo-router'
import { useState, useEffect, useRef } from 'react'
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, Linking, Button } from 'react-native'
import * as Notifications from 'expo-notifications'
import {
  registerForPushNotifications,
  setNotificationHandler,
  setNotificationReceiver,
  storeDeviceToken,
  removeDeviceToken,
  getStoredDeviceTokens,
} from '@/functions/notificationHelper'

// Toggle cylinder for settings
const Toggle = ({ isBool, setIsBool }: { isBool: boolean, setIsBool: (bool: boolean) => void }) => {
    return (
        <TouchableOpacity
            onPress={() => setIsBool(!isBool)}
            style={[
                styles.toggleContainer,
                isBool ? { backgroundColor: Colors.blue, alignItems: 'flex-end' }
                    : { backgroundColor: Colors.grey, alignItems: 'flex-start' }
            ]}
        >
            <View style={styles.toggleCircle} />
        </TouchableOpacity>
    )
}

// Setting container with title, description, and toggle button
interface SettingProps {
    title: string
    description: string
    isBool: boolean
    setIsBool: (bool: boolean) => void
}

const Setting = ({ title, description, isBool, setIsBool }: SettingProps) => {
    return (
        <View style={styles.settingContainer}>
            <View style={styles.settingBox}>
                <TextInter style={{ fontWeight: '500', fontSize: 18 }}>
                    {title}
                </TextInter>

                <TextInter style={{ color: Colors.grey, fontWeight: '500', fontSize: 14 }}>
                    {description}
                </TextInter>
            </View>

            <Toggle isBool={isBool} setIsBool={setIsBool} />
        </View>
    )
}

// Notifications screen
const NotificationsScreen = () => {
    const router = useRouter()
    const [isEmailNotif, setIsEmailNotif] = useState(false)
    const [isAppNotif, setIsAppNotif] = useState(false)
    const [isExpirationNotif, setIsExpirationNotif] = useState(true)
    const [isLowQuantityNotif, setIsLowQuantityNotif] = useState(true)

    const notificationListener = useRef<any>()
    const responseListener = useRef<any>()

    // Initialize notification handlers
    useEffect(() => {
        notificationListener.current = setNotificationReceiver((notification) => {
            const { title, body } = notification.request.content
            console.log('Received notification:', { title, body })
        })

        responseListener.current = setNotificationHandler((response) => {
            const { title, body } = response.notification.request.content
            console.log('Notification response:', { title, body })
        })

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current)
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current)
            }
        }
    }, [])

    // Function to handle notification permission
    const handleNotificationSetup = async () => {
        console.log('Starting notification setup')
        try {
            console.log('Requesting system permission...')
            const { status } = await Notifications.requestPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                },
            })
            console.log('Permission status after request:', status)

            if (status === 'granted') {
                const token = await registerForPushNotifications()
                if (token) {
                    storeDeviceToken(token)
                    Alert.alert('Success', 'Notification permissions granted!')
                }
            } else {
                Alert.alert(
                    'Permission Required',
                    'Please enable notifications in Settings to receive important updates',
                    [
                        { 
                            text: 'Open Settings', 
                            onPress: () => Linking.openSettings() 
                        },
                        { 
                            text: 'Cancel', 
                            style: 'cancel' 
                        }
                    ]
                )
            }
        } catch (error) {
            console.error('Error in notification setup:', error)
            Alert.alert('Error', 'Failed to setup notifications')
        }

    }
    // Function to send a test notification to all stored devices
    async function sendTestNotification() {
        const deviceTokens = getStoredDeviceTokens(); // Retrieve stored device tokens  

        if (deviceTokens.length === 0) {
            console.log("No stored device tokens available.");
            return;
        }   

        for (const device of deviceTokens) {
            try {
                await fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: device.deviceToken, // Expo push token
                        title: "Test Notification",
                        body: "This is a test notification.",
                        data: { message: "Hello from push notification!" },
                    }),
                });
                console.log(`Notification sent to ${device.deviceName} (${device.deviceToken})`);
            } catch (error) {
                console.error(`Failed to send notification to ${device.deviceName}:`, error);
            }
        }
    }

    return (
        <View style={styles.container}>
            <BlueHeader
                headerText={'Notifications'}
                onPress={() => router.push('/profile/profile')}
            />

            <ScrollView style={styles.scrollContainer}>
                <View style={styles.innerContainer}>
                    <Setting
                        title={'Email Notifications'}
                        description={'Receive notifications via email.'}
                        isBool={isEmailNotif}
                        setIsBool={setIsEmailNotif}
                    />
                    <Setting
                        title={'App Notifications'}
                        description={'Receive notifications from the app.'}
                        isBool={isAppNotif}
                        setIsBool={async (value) => {
                            setIsAppNotif(value)
                            if (value) {
                                await handleNotificationSetup()
                            } else {
                                const token = await registerForPushNotifications()
                                if (token) removeDeviceToken()
                            }
                        }}                      

                    />
                    <Setting
                        title={'Notify for expirations'}
                        description={'Receive notifications for expiring chemicals.'}
                        isBool={isExpirationNotif}
                        setIsBool={setIsExpirationNotif}
                    />
                    <Setting
                        title={'Notify for low quantity'}
                        description={'Receive notifications for chemicals with low quantity.'}
                        isBool={isLowQuantityNotif}
                        setIsBool={setIsLowQuantityNotif}
                    />
                    <Button title="Test Notification" onPress={sendTestNotification} />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.offwhite,
        alignItems: 'center',
    },
    scrollContainer: {
        width: '100%',
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Size.height(136),
        marginHorizontal: Size.width(34),
    },
    settingContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightgrey,
    },
    settingBox: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        paddingVertical: Size.height(18),
    },
    toggleContainer: {
        width: Size.width(50),
        height: Size.height(30),
        borderRadius: Size.width(15),
        justifyContent: 'center',
        paddingHorizontal: 3,
        marginLeft: Size.width(40),
    },
    toggleCircle: {
        width: Size.width(23),
        height: Size.height(23),
        backgroundColor: Colors.white,
        borderRadius: Size.width(15),
    },
})

export default NotificationsScreen
