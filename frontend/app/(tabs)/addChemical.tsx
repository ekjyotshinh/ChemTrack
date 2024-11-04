import CustomButton from '@/components/CustomButton';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import Header from '@/components/Header';
import CustomTextHeader from '@/components/inputFields/CustomTextHeader';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CasTextBoxes from '@/components/inputFields/CasTextBoxes';
import UploadIcon from '@/assets/icons/UploadIcon';
import ReturnIcon from '@/assets/icons/ReturnIcon';
import SaveIcon from '@/assets/icons/SaveIcon';
import DateInput from '@/components/inputFields/DateInput';

export default function ViewChemicals() {
  const [name, setName] = useState<string>('')
  const [room, setRoom] = useState<string>('')
  const [shelf, setShelf] = useState<string>('')
  const [cabinet, setCabinet] = useState<string>('')
  const [casParts, setCasParts] = useState<string[]>(['', '', ''])
  const [purchaseDate, setPurchaseDate] = useState<Date>()
  const [expirationDate, setExpirationDate] = useState<Date>()

  return (
    <View style={styles.container}>
      <Header headerText='Add Chemical' />
      <ScrollView style={styles.scroll}>
        <View style={styles.innerContainer}>

          {/* Name */}
          <HeaderTextInput
            headerText='Name'
            onChangeText={(value: string) => { setName(value) }}
          />

          {/* CAS Number */}
          <View style={{ marginTop: 10 }}>
            <CustomTextHeader headerText='CAS Number' />
            <CasTextBoxes casParts={casParts} setCasParts={setCasParts} />
          </View>

          {/* Purchase and Expiration Dates */}
          <View style={styles.row}>
            <DateInput date={purchaseDate} setDate={setPurchaseDate} inputWidth={154} headerText={'Purchase Date'} />
            <DateInput date={expirationDate} setDate={setExpirationDate} inputWidth={154} headerText={'Expiration Date'} />
          </View>

          {/* Room, cabinet, shelf number */}
          <View style={styles.row}>
            <HeaderTextInput
              headerText={'Room'}
              onChangeText={(value: string) => setRoom(value)}
              inputWidth={111}
            />
            <HeaderTextInput
              headerText={'Cabinet'}
              onChangeText={(value: string) => setCabinet(value)}
              inputWidth={88}
              isNumeric={true}
            />
            <HeaderTextInput
              headerText={'Shelf'}
              onChangeText={(value: string) => setShelf(value)}
              inputWidth={88}
              isNumeric={true}
            />
          </View>

          {/* SDS button */}
          <View style={{ marginTop: 10 }}>
            <CustomTextHeader headerText={'SDS'} />
            <CustomButton
              title={'Upload'}
              onPress={() => { console.log('Clicked SDS upload!') }}
              width={84}
              icon={<UploadIcon width={24} height={24} />}
              iconPosition="left"
              color='white'
              textColor='black'
            />
          </View>

          {/* Save and clear buttons */}
          <CustomButton
            title={'Save Chemical'}
            onPress={() => { console.log('Clicked save!') }}
            width={84}
            icon={<SaveIcon width={24} height={24} color='none' />}
            iconPosition="left"
          />

          <CustomButton
            title={'Clear'}
            onPress={() => { console.log('Clicked clear!') }}
            width={84}
            icon={<ReturnIcon width={24} height={24} />}
            iconPosition="left"
            color='#FF0035'
            textColor='white'
          />

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9'
  },
  innerContainer: {
    marginTop: 150,
    marginHorizontal: '8%',
  },
  scroll: {
    width: '100%',
  },
  row: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});
