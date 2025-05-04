import BlueHeader from '@/components/BlueHeader'
import TextInter from '@/components/TextInter'
import Colors from '@/constants/Colors'
import Size from '@/constants/Size'
import { useRouter } from 'expo-router'
import { useState, useEffect, useRef } from 'react'
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native'
import * as Notifications from 'expo-notifications'
import { useUser } from '@/contexts/UserContext';
import { API_URL } from '@/constants/API';
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
    const { userInfo, updateUserInfo } = useUser();
    const [isEmailNotif, setIsEmailNotif] = useState(userInfo.allow_email)
    const [isAppNotif, setIsAppNotif] = useState(userInfo.allow_push)
    const [isExpirationNotif, setIsExpirationNotif] = useState(true)
    const [isLowQuantityNotif, setIsLowQuantityNotif] = useState(true)


    const notificationListener = useRef<any>()
    const responseListener = useRef<any>()

    // Initialize notification handlers
    useEffect(() => {
        notificationListener.current = setNotificationReceiver((notification) => {
            const { title, body } = notification.request.content
            //console.log('Received notification:', { title, body })
        })

        responseListener.current = setNotificationHandler((response) => {
            const { title, body } = response.notification.request.content
            //console.log('Notification response:', { title, body })
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
        //console.log('Starting notification setup')
        try {
            //console.log('Requesting system permission...')
            const { status } = await Notifications.requestPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                },
            })
            //console.log('Permission status after request:', status)

            if (status === 'granted') {
                const token = await registerForPushNotifications()
                if (token) {
                    const res = await storeDeviceToken(token,userInfo.id)
                    if (!res){
                        Alert.alert('Error', 'Failed to store device token')
                    }
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

    const updateUserPreferences = async (preferences: {
        allow_email?: boolean;
        allow_push?: boolean;
    }) => {
        try {
            const updatedPreferences = {
                allow_email: preferences.allow_email ?? userInfo.allow_email,
                allow_push: preferences.allow_push ?? userInfo.allow_push,          
                is_admin: userInfo.is_admin,    // currently if these flags are not passed we set them to false
                is_master: userInfo.is_master,  // currently if these flags are not passed we set them to false
            };

            const response = await fetch(`${API_URL}/api/v1/users/${userInfo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPreferences),
            });

            if (!response.ok) {
                throw new Error('Failed to update preferences');
            }

            updateUserInfo({
                ...userInfo,
                allow_email: updatedPreferences.allow_email,
                allow_push: updatedPreferences.allow_push,
            });
            //console.log('User preferences updated successfully');
            Alert.alert('Success', 'Your preferences have been updated!');
            return true;
        } catch (error) {
            console.error('Error updating user preferences:', error);
            Alert.alert('Error', 'Failed to update notification preferences.');
            return false;
        }
    };

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
                        setIsBool={async (value) => {
                            const success = await updateUserPreferences({ allow_email: value });
                            if (success) setIsEmailNotif(value);
                        }}
                    />
                    <Setting
                        title={'App Notifications'}
                        description={'Receive notifications from the app.'}
                        isBool={isAppNotif}
                        setIsBool={async (value) => {
                            if (value) {
                                await handleNotificationSetup();
                            } 
                            const success = await updateUserPreferences({ allow_push: value });
                            if (success) setIsAppNotif(value);
                        }}
                    />
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
