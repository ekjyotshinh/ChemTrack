import React, { useState } from 'react'
import { TouchableOpacity, View, StyleSheet, Text, Platform } from 'react-native'
import CustomTextHeader from './CustomTextHeader'
import CalendarIcon from '@/assets/icons/CalendarIcon'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import RNDateTimePicker from '@react-native-community/datetimepicker'

interface DateProps {
    date: Date | undefined,
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>,
    headerText: string,
    inputWidth: number,
}

export default function DateInput({ date, setDate, headerText, inputWidth }: DateProps) {
    const [show, setShow] = useState<boolean>(false)
    const isAndroid = Platform.OS === 'android'

    const onChange = (newDate: Date | undefined) => {
        setShow(!show)
        setDate(newDate)
    }
    return (
        <View style={{ width: inputWidth || '100%' }}>
            <CustomTextHeader headerText={headerText} />
            <View style={styles.container}>
                <TouchableOpacity style={styles.btn} onPress={() => { setShow(!show) }}>
                    <View style={styles.content}>
                        {/* Format the date into a string */}
                        <Text style={{ textAlignVertical: 'center' }}>
                            {date?.toISOString().split('T')[0]}
                        </Text>
                        <CalendarIcon color='#BFBFBF' />
                    </View>
                </TouchableOpacity>

                {
                    // use RNDateTimePicker for Android since spinner is nice
                    isAndroid ? show && <RNDateTimePicker
                        // use current date is user hasn't entered anything yet
                        // otherwise, default to user input
                        value={date ?? new Date()}
                        mode="date"
                        display={'spinner'}
                        onChange={(e: any, newDate: Date | undefined) => { onChange(newDate) }}
                    /> : 
                    // on iOS use DateTimePickerModal becauase date selection looks better on 
                    // iOS than with RNDateTimePicker
                    <DateTimePickerModal
                        date={date ?? new Date()}
                        isVisible={show}
                        mode='date'
                        onConfirm={onChange}
                        onCancel={() => { setShow(!show) }}
                    />
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        marginTop: 0,
        borderWidth: 1,
        borderColor: '#BFBFBF',
        backgroundColor: '#FFFFFF',
        flex: 1,
        flexDirection: 'row',
    },
    content: {
        paddingLeft: 15,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: 6,
    },
    btn: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    }
});
