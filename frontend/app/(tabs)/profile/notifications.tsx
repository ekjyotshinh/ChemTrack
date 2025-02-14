import BlueHeader from '@/components/BlueHeader'
import TextInter from '@/components/TextInter'
import Colors from '@/constants/Colors'
import Size from '@/constants/Size'
import { useRouter } from 'expo-router'
import { View, ScrollView, StyleSheet } from 'react-native'

interface SettingProps {
    text: string
    onPress: () => void
}

const Setting = ({ text, onPress }: SettingProps) => {
    return (
        <View style={styles.settingBox}>
            <TextInter style={{ fontWeight: '500', fontSize: 16 }}>
                {text}
            </TextInter>

            <TextInter style={{ color: Colors.grey, fontSize: 14 }}>
                Description
            </TextInter>
        </View>
    )
}

const Notifications = () => {
    const router = useRouter()

    return (
        <View style={styles.container}>
            <BlueHeader
                headerText={'Notifications'}
                onPress={() => router.push('/profile/profile')}
            />

            <ScrollView style={styles.scrollContainer}>
                <View style={styles.innerContainer}>
                    <Setting text={'Email Notifications'} onPress={() => { }} />
                    <Setting text={'Phone Notifications'} onPress={() => { }} />
                    <Setting text={'Notify for expirations'} onPress={() => { }} />
                    <Setting text={'Notify for low quantity'} onPress={() => { }} />
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
    settingBox: {
        width: '100%',
        paddingVertical: Size.height(18),
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightgrey,
    }
})

export default Notifications