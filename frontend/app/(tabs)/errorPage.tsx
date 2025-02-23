import HomeIcon from '@/assets/icons/HomeIcon'
import BlueHeader from '@/components/BlueHeader'
import CustomButton from '@/components/CustomButton'
import TextInter from '@/components/TextInter'
import Colors from '@/constants/Colors'
import Size from '@/constants/Size'
import { useRouter } from 'expo-router'
import { StyleSheet, View, ScrollView } from 'react-native'

export default function ErrorPage() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <BlueHeader headerText={'Unauthorized'} onPress={() => router.back()} />
      <ScrollView style={styles.scroll}>
        <View style={styles.innerContainer}>
          <TextInter style={styles.text}>You do not have access to view this page</TextInter>
          <CustomButton
            title={'Return Home'}
            onPress={() => router.push('/')}
            width={Size.width(340)}
            icon={<HomeIcon color={Colors.white} width={24} height={24} />}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.offwhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    marginHorizontal: Size.width(33),

  },
  scroll: {
    width: '100%',
  },
  text: {
    fontSize: 24,
    fontWeight: 'semibold',
    textAlign: 'center',
    marginBottom: Size.height(40),
    color: Colors.black,
  }
})