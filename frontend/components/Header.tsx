import Colors from '@/constants/Colors'
import { StyleSheet, View } from 'react-native'
import TextInter from './TextInter'
import Size from '@/constants/Size'

interface headerProps {
    headerText: string
}

export default function Header({ headerText } : headerProps) {

    // Split header text in 2 strings: 1st is blue, 2nd is black
    const list: string[] = headerText.split(' ')

    return (
        <View style={styles.container}>
            <TextInter style={styles.header}>
                <TextInter style={styles.span}>
                    {list[0] + ' '}
                </TextInter>
                {list[1]}
            </TextInter>
        </View>
    )
}

const styles = StyleSheet.create({
    // the header section should be sticky and not
    // be affected by scroll
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        width: '100%',
        height: Size.height(117),
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: Colors.offwhite
    },
    span: {
        color: Colors.blue,
        fontWeight: 'bold'
    },
    header: {
        marginBottom: 11,
        fontSize: 30,
        fontWeight: 'bold',
        // make sure this matches margin for
        // the screen so the text lines up
        marginHorizontal: Size.width(33),
    }
});
