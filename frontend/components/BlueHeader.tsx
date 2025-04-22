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

// Add elipsis to long chemical names >= 30 characters
const processChemName = (name: string) => {
  name = name.toString();
  if (name.length <= 30) {
    return name;
  }
  return name.substring(0, 27) + '...';
}

export default function BlueHeader({ headerText, onPress } : headerProps) {

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity onPress={onPress} style={styles.icon}>
                    <Ionicons style={{marginBottom: 11}} name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <TextInter style={styles.header}>{processChemName(headerText)}</TextInter>
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
        marginHorizontal: Size.width(50),
    }
});
