import CustomButton from '@/components/CustomButton';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import Header from '@/components/Header';
import CustomTextHeader from '@/components/inputFields/CustomTextHeader';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CasTextBoxes from '@/components/inputFields/CasTextBoxes';
import UploadIcon from '@/assets/icons/UploadIcon';
import ReturnIcon from '@/assets/icons/ReturnIcon';
import SaveIcon from '@/assets/icons/SaveIcon';
import DateInput from '@/components/inputFields/DateInput';
import DropdownInput from '@/components/inputFields/DropdownInput';
import ResetIcon from '@/assets/icons/ResetIcon';

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

  const [uploaded, setUploaded] = useState<boolean>(false)

  // will be used later for updating the text to match file name
  const [uploadText, setUploadText] = useState<string>('')

  const [isFilled, setIsFilled] = useState<boolean>(false)

  const stringInputs: string[] = [name, room, shelf, cabinet, school, status, quantity]
  const dateInputs: (Date | undefined)[] = [purchaseDate, expirationDate]
  const allInputs: any = [...stringInputs, ...dateInputs, ...casParts, uploaded]

  // check if all fields have been added or not
  useEffect(() => {
    const areStringsComplete: boolean = stringInputs.every(string => string.trim() !== '')
    const areDatesComplete: boolean = dateInputs.every(date => date !== undefined)
    const isCasComplete: boolean = casParts.every(string => string.trim() !== '')

    if (areStringsComplete && areDatesComplete && isCasComplete && uploaded) {
      setIsFilled(true)
    } else {
      setIsFilled(false)
    }
  }, allInputs)
  
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
    if (isFilled) {
      console.log('Clicked save!')
    } else {
      console.log('Please fill in all fields!')
    }
  }

  const onClear = () => {
    console.log('Clicked clear!')
    setName('')
    setRoom('')
    setShelf('')
    setCabinet('')
    setSchool('')
    setStatus('')
    setQuantity('')
    setCasParts(['', '', ''])
    setPurchaseDate(undefined)
    setExpirationDate(undefined)
    setUploaded(false)
  }

  const onUpload = () => {
    console.log('Clicked SDS upload!')
    setUploaded(!uploaded)
  }

  return (
    <View style={styles.container}>
      <Header headerText='Add Chemical' />
      <ScrollView style={styles.scroll}>
        <View style={styles.innerContainer}>

          {/* Name */}
          <HeaderTextInput
            headerText='Name'
            value={name}
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
              value={room}
            />
            <HeaderTextInput
              headerText={'Cabinet'}
              onChangeText={(value: string) => setCabinet(value)}
              inputWidth={88}
              isNumeric={true}
              value={cabinet}
            />
            <HeaderTextInput
              headerText={'Shelf'}
              onChangeText={(value: string) => setShelf(value)}
              inputWidth={88}
              isNumeric={true}
              value={shelf}
            />
          </View>

          {/* SDS button */}
          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <CustomTextHeader headerText={'SDS'} />
            <CustomButton
              title={ uploaded ? 'placeholder_sds.pdf' : 'Upload'}
              onPress={onUpload}
              width={84}
              icon={ uploaded ?
                <ResetIcon width={24} height={24} color='white' /> :
                <UploadIcon width={24} height={24} />
              }
              iconPosition="left"
              color={ uploaded ? 'black' : 'white'}
              textColor={ uploaded ? 'white' : 'black'}
            />
          </View>

          {/* Save and Clear buttons */}
          <CustomButton
            title={'Save Chemical'}
            textColor={isFilled ? 'white' : '#BFBFBF'}
            color={isFilled ? '#0F82FF' : 'white'}
            onPress={onSave}
            width={84}
            icon={<SaveIcon width={24} height={24} color={isFilled ? 'white' : '#BFBFBF'} />}
            iconPosition="left"
          />

          <CustomButton
            title={'Clear'}
            onPress={onClear}
            width={84}
            icon={<ReturnIcon width={24} height={24} />}
            iconPosition="left"
            color='#FF0035'
            textColor='white'
          />

          {/* Extra padding */}
          <View style={{ height: 40 }}/>

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
    backgroundColor: '#F9F9F9',
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
