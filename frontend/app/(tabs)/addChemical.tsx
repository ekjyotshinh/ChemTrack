import CustomButton from '@/components/CustomButton';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import Header from '@/components/Header';
import CustomTextHeader from '@/components/inputFields/CustomTextHeader';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import CasTextBoxes from '@/components/inputFields/CasTextBoxes';
import UploadIcon from '@/assets/icons/UploadIcon';
import ReturnIcon from '@/assets/icons/ReturnIcon';
import SaveIcon from '@/assets/icons/SaveIcon';
import DateInput from '@/components/inputFields/DateInput';
import DropdownInput from '@/components/inputFields/DropdownInput';
import ResetIcon from '@/assets/icons/ResetIcon';
import Colors from '@/constants/Colors';
import Size from '@/constants/Size';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';

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
  // used for pdf upload for sds
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

  const [isFilled, setIsFilled] = useState<boolean>(false)

  const stringInputs: string[] = [name, room, shelf, cabinet, school, status, quantity]
  const dateInputs: (Date | undefined)[] = [purchaseDate, expirationDate]
  const allInputs: any = [...stringInputs, ...dateInputs, ...casParts, uploaded]
  const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;

  const router = useRouter();


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
    { label: 'Encina High School', value: 'Encina High School' },
    { label: 'Sacramento High School', value: 'Sacramento High School' },
    { label: 'Foothill High School', value: 'Foothill High School' },
    { label: 'Grant Union High School', value: 'Grant Union High School' },
  ]

  const statuses = [
    { label: 'On-site', value: 'On-site' },
    { label: 'Off-site', value: 'Off-site' },
  ]

  const quantities = [
    { label: 'Good', value: 'Good' },
    { label: 'Fair', value: 'Fair' },
    { label: 'Low', value: 'Low' },
  ]

  // Upload pdf

  const uploadPdf = async () => {
    try {
      // Get pdf
      const pickedPdf = await DocumentPicker.getDocumentAsync({
        multiple: false, // allow user to only select 1 file
        type: ["application/pdf"], // Restrict to pdfs only
        //copyToCacheDirectory: false,
      });

      // if selection goes through
      if (!pickedPdf.canceled) {
        // Check success
        const successfulResult = pickedPdf as DocumentPicker.DocumentPickerSuccessResult;
        console.log('Got the pdf: ', pickedPdf);
        console.log('File assets: ', pickedPdf.assets);
        //const {name, size, uri, mimeType, lastModified,file} = pickedPdf as DocumentPicker.DocumentPickerAsset;
      } else {
        Alert.alert("Pdf selection canceled.");
        console.log("Pdf selection canceled.");
      }


    } catch (error) {
      console.log(error);
    };
    setUploaded(!uploaded);
    Alert.alert('PDF Uploaded!');
  };

  // Saves form
  const onSave = async () => {
    if (isFilled) {
      // Prepare the data to send to the backend
      // Format the date to "YYYY-MM-DD"
      const formatDate = (date: Date | null | undefined): string | undefined =>
        date ? date.toISOString().split('T')[0] : undefined;
      const data = {
        name,
        cas: parseInt(casParts.join(''), 10), // Concatenate CAS parts into one string
        school,
        purchase_date: formatDate(purchaseDate), // Format the date as "YYYY-MM-DD"
        expiration_date: formatDate(expirationDate),
        status,
        quantity,
        room,
        shelf: parseInt(shelf, 10), // Convert shelf to integer (if it's a number)
        cabinet: parseInt(cabinet, 10), // Convert cabinet to integer (if it's a number)
      };

      try {
        // Send the data to the backend
        console.log('Request data:', JSON.stringify(data, null, 2));

        const response = await fetch(`${API_URL}/api/v1/chemicals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const responseData = await response.json();

        if (response.ok) {
          // Handle successful response
          console.log('Chemical added successfully:', responseData);
          onClear();
          Alert.alert('Success', 'Chemical information added');
          router.push('/');
        } else {
          // Handle server errors
          console.log('Failed to add chemical:', responseData);
          Alert.alert('Error', 'Error occured');
        }
      } catch (error) {
        console.error('Error adding chemical:', error);
        Alert.alert('Error', 'Error occured');
      }
    } else {
      console.log('Please fill in all fields!');
      Alert.alert('Error', 'Please fill in all fields!');
    }
  };

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
          <View style={{ marginTop: Size.width(10) }}>
            <CustomTextHeader headerText='CAS Number' />
            <CasTextBoxes casParts={casParts} setCasParts={setCasParts} />
          </View>

          {/* Purchase and Expiration Dates */}
          <View style={styles.row}>
            <DateInput date={purchaseDate} setDate={setPurchaseDate} inputWidth={Size.width(154)} headerText={'Purchase Date'} />
            <DateInput date={expirationDate} setDate={setExpirationDate} inputWidth={Size.width(154)} headerText={'Expiration Date'} />
          </View>

          {/* Status and Quality */}
          <View style={styles.row}>
            <View style={{ width: Size.width(154) }}>
              <CustomTextHeader headerText='Status' />
              <DropdownInput data={statuses} value={status} setValue={setStatus} />
            </View>

            <View style={{ width: Size.width(154) }}>
              <CustomTextHeader headerText='Quantity' />
              <DropdownInput data={quantities} value={quantity} setValue={setQuantity} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ width: Size.width(180) }}>
              <CustomTextHeader headerText='School' />
              <DropdownInput data={schools} value={school} setValue={setSchool} />
            </View>
          </View>

          {/* Room, cabinet, shelf number */}
          <View style={styles.row}>
            <HeaderTextInput
              headerText={'Room'}
              onChangeText={(value: string) => setRoom(value)}
              inputWidth={Size.width(111)}
              value={room}
            />
            <HeaderTextInput
              headerText={'Cabinet'}
              onChangeText={(value: string) => setCabinet(value)}
              inputWidth={Size.width(88)}
              isNumeric={true}
              value={cabinet}
            />
            <HeaderTextInput
              headerText={'Shelf'}
              onChangeText={(value: string) => setShelf(value)}
              inputWidth={Size.width(88)}
              isNumeric={true}
              value={shelf}
            />
          </View>

          {/* SDS button */}
          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <CustomTextHeader headerText={'SDS'} />
            <View style={{ alignItems: 'center' }}>
              <CustomButton
                title={uploaded ? 'placeholder_sds.pdf' : 'Upload'}
                onPress={uploadPdf}
                width={337}
                icon={uploaded ?
                  <ResetIcon width={24} height={24} color='white' /> :
                  <UploadIcon width={24} height={24} />
                }
                iconPosition="left"
                color={uploaded ? 'black' : 'white'}
                textColor={uploaded ? 'white' : 'black'}
              />
            </View>
          </View>

          <View style={{ alignItems: 'center' }}>
            {/* Save and Clear buttons */}
            <CustomButton
              title={'Save Chemical'}
              textColor={isFilled ? 'white' : Colors.grey}
              color={isFilled ? Colors.blue : 'white'}
              onPress={onSave}
              width={337}
              icon={<SaveIcon width={24} height={24} color={isFilled ? 'white' : Colors.grey} />}
              iconPosition="left"
            />

            <CustomButton
              title={'Clear'}
              onPress={onClear}
              width={337}
              icon={<ReturnIcon width={24} height={24} />}
              iconPosition="left"
              color={Colors.red}
              textColor='white'
            />
          </View>

          {/* Extra padding */}
          <View style={{ height: 40 }} />

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
    backgroundColor: Colors.offwhite,
  },
  innerContainer: {
    marginTop: Size.height(136),
    marginHorizontal: Size.width(33),
  },
  scroll: {
    width: '100%',
  },
  row: {
    marginTop: Size.width(10),
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});
