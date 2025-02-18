import BlueHeader from '@/components/BlueHeader'
import TextInter from '@/components/TextInter'
import Colors from '@/constants/Colors'
import Size from '@/constants/Size'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'

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

// Notifications screeen
const Notifications = () => {
    const router = useRouter()
    const [isEmailNotif, setIsEmailNotif] = useState(true)
    const [isAppNotif, setIsAppNotif] = useState(true)
    const [isExpirationNotif, setIsExpirationNotif] = useState(true)
    const [isLowQuantityNotif, setIsLowQuantityNotif] = useState(true)

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
                        setIsBool={setIsAppNotif}
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

export default Notifications