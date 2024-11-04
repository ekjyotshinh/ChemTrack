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
import DropdownInput from '@/components/inputFields/DropdownInput';

export default function ViewChemicals() {
  const [name, setName] = useState<string>('')
  const [room, setRoom] = useState<string>('')
  const [shelf, setShelf] = useState<string>('')
  const [cabinet, setCabinet] = useState<string>('')
  const [school, setSchool] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')

  const [casParts, setCasParts] = useState<string[]>(['', '', ''])

  const [purchaseDate, setPurchaseDate] = useState<Date>()
  const [expirationDate, setExpirationDate] = useState<Date>()

  const stringInputs: string[] = [name, room, shelf, cabinet, school, status, quantity]
  const dateInputs: (Date | undefined)[] = [purchaseDate, expirationDate]
  
  const schools = [
    { label: 'Encina High School', value: '1' },
    { label: 'Sacramento High School', value: '2' },
    { label: 'Foothill High School', value: '3' },
    { label: 'Grant Union High School', value: '4' },
  ]

  const statuses = [
    { label: 'On-site', value: '1' },
    { label: 'Off-site', value: '2' },
  ]

  const quantities = [
    { label: 'Good', value: '1' },
    { label: 'Fair', value: '2' },
    { label: 'Low', value: '3' },
  ]

  const onSave = () => {
    console.log('Clicked save!')
  }

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

          {/* Status and Quality */}
          <View style={styles.row}>
            <View style={{width: 154}}>
              <CustomTextHeader headerText='Status' />
              <DropdownInput data={statuses} value={status} setValue={setStatus}/>
            </View>

            <View style={{width: 154}}>
              <CustomTextHeader headerText='Quantity' />
              <DropdownInput data={quantities} value={quantity} setValue={setQuantity} />
            </View>
          </View>

          <View style={styles.row}>
            <View>
              <CustomTextHeader headerText='School' />
              <DropdownInput data={schools} value={school} setValue={setSchool} />
            </View>
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
            onPress={onSave}
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
