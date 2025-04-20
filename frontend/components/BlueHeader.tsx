import Colors from '@/constants/Colors'
import React from 'react'
import { StyleSheet, View, TouchableOpacity, GestureResponderEvent} from 'react-native'
import TextInter from './TextInter'
import Size from '@/constants/Size'
import { Ionicons } from '@expo/vector-icons'

interface headerProps {
    headerText: string,
    onPress: (event: GestureResponderEvent) => void
}

export default function BlueHeader({ headerText, onPress } : headerProps) {

    // Split header text in 2 strings: 1st is blue, 2nd is black
    const list: string[] = headerText.split(' ')

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity onPress={onPress} style={styles.icon}>
                    <Ionicons style={{marginBottom: 11}} name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <TextInter style={styles.header}>{headerText}</TextInter>
            </View>
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
        height: Size.height(100),
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: Colors.blue
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        position: 'absolute',
        left: Size.width(24),
        zIndex: 1,
    },
    header: {
        marginBottom: Size.height(15),
        fontSize: 22,
        color: Colors.white,
        fontWeight: 'bold',
        textAlign: 'center',
        // make sure this matches margin for
        // the screen so the text lines up
        marginHorizontal: Size.width(33),
    }
});
