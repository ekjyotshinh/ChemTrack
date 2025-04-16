import CustomButton from '@/components/CustomButton';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import Header from '@/components/Header';
import CustomTextHeader from '@/components/inputFields/CustomTextHeader';
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
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
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import ErrorPage from './errorPage';
import fetchSchoolList from '@/functions/fetchSchool';

export default function AddChemical() {
  const { userInfo } = useUser()
  const [name, setName] = useState<string>('')
  const [room, setRoom] = useState<string>('')
  const [shelf, setShelf] = useState<string>('')
  const [cabinet, setCabinet] = useState<string>('')
  const [school, setSchool] = useState<string>(userInfo && userInfo.is_admin ? userInfo.school : '')
  const [status, setStatus] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [unit, setUnit] = useState<string>('');

  const [casParts, setCasParts] = useState<string[]>(['', '', ''])

  const [purchaseDate, setPurchaseDate] = useState<Date>()
  const [expirationDate, setExpirationDate] = useState<Date>()

  const [uploaded, setUploaded] = useState<boolean>(false)

  // will be used later for updating the text to match file name
  const [uploadText, setUploadText] = useState<string>('')

  const [isFilled, setIsFilled] = useState<boolean>(false)

  const stringInputs: string[] = [name, room, shelf, cabinet, school, status, quantity, unit]
  const dateInputs: (Date | undefined)[] = [purchaseDate, expirationDate]
  const allInputs: any = [...stringInputs, ...dateInputs, ...casParts, uploaded]
  const sdsForm = useRef<FormData | null>(null);
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

  const [schoolList, setSchoolList] = useState<any>([{ label: '', value: '' }]);

  useEffect(() => {
    fetchSchoolList({ setSchoolList });
  }, []);

  const statuses = [
    { label: 'Good', value: 'Good' },
    { label: 'Fair', value: 'Fair' },
    { label: 'Low', value: 'Low' },
    { label: 'Off-site', value: 'Off-site' },
  ];

  const units = [
    { label: 'mL', value: 'mL' },
    { label: 'L', value: 'L' },
    { label: 'kL', value: 'kL' },
    { label: 'g', value: 'g' },
    { label: 'kg', value: 'kg' },
  ];

  // Empty form Data
  const emptyFormData = () => {
    sdsForm.current = new FormData();
    setUploaded(false);
  };

  // Upload pdf

  const uploadPdf = async () => {
    try {
      // Get pdf
      const pickedPdf = await DocumentPicker.getDocumentAsync({
        multiple: false, // allow user to only select 1 file
        type: "application/pdf", // Restrict to pdfs only
        copyToCacheDirectory: false,
      });

      // if selection goes through
      if (pickedPdf && !pickedPdf.canceled) {
        // Check success
        const successfulResult = pickedPdf as DocumentPicker.DocumentPickerSuccessResult;
        console.log('Got the pdf: ', pickedPdf);
        console.log('File assets: ', pickedPdf.assets); //file, lastModified, mimeType, name, size, uri;
        console.log('File Name: ', pickedPdf.assets[0].name);
        processFileName(pickedPdf.assets[0].name);
        sdsForm.current = new FormData();
        sdsForm.current.append('sds', {
          uri: pickedPdf.assets[0].uri,
          name: pickedPdf.assets[0].name,
          type: pickedPdf.assets[0].mimeType,
        } as any);

        setUploaded(true);
        Alert.alert('PDF Uploaded!');
      } else {
        Alert.alert("Pdf selection canceled.");
        console.log("Pdf selection canceled.");
      }


    } catch (error) {
      console.log(error);
    };
  };
  // Add elipsis to long file names >= 20 characters
  const processFileName = (name: string) => {
    name = name.toString();
    name = name.split('.').slice(0, -1).join('.'); // remove pdf extension
    if (name.length <= 20) {
      setUploadText(name);
    } else if (name.length > 20) {
      setUploadText(name.substring(0, 20) + '...');
    } else {
      setUploadText('File Uploaded');
    }

  }

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
        quantity: [quantity, unit].filter(Boolean).join(' '),
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
          console.log(sdsForm);
          const pdfResponse = await fetch(`${API_URL}/api/v1/files/sds/${responseData.chemical.id}`, {
            method: 'POST',
            body: sdsForm.current!,
          });
          if (pdfResponse.ok) {
            onClear();
            Alert.alert('Success', 'Chemical information added');
            router.push('/');
          } else {
            console.log('Failed to add pdf:', pdfResponse);
            Alert.alert('Error', 'Error occured');
          }
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
    emptyFormData();
    setUnit('')
  }


  return (
    <>
      {userInfo && (userInfo.is_admin || userInfo.is_master) ? (
        <View style={styles.container}>
          <Header headerText='Add Chemical' />
          <ScrollView style={styles.scroll}>
            <View style={styles.innerContainer}>

              {/* Name */}
              <HeaderTextInput
                headerText='Name'
                value={name}
                onChangeText={(value: string) => { setName(value) }}
                testID='name-input'
              />

              {/* CAS Number */}
              <View style={{ marginTop: Size.width(10) }}>
                <CustomTextHeader headerText='CAS Number' />
                <CasTextBoxes casParts={casParts} setCasParts={setCasParts} testIDs={['cas-0', 'cas-1', 'cas-2']} />
              </View>

              {/* Purchase and Expiration Dates */}
              <View style={styles.row}>
                <DateInput
                  date={purchaseDate}
                  setDate={setPurchaseDate}
                  inputWidth={Size.width(154)}
                  headerText={'Purchase Date'}
                  testID='purchase-date'
                />
                <DateInput
                  date={expirationDate}
                  setDate={setExpirationDate}
                  inputWidth={Size.width(154)}
                  headerText={'Expiration Date'}
                  testID='expiration-date'
                />
              </View>

              {/* Status and Quality */}
              <View style={styles.row}>
                <View style={{ width: Size.width(111) }}>
                  <CustomTextHeader headerText='Status' />
                  <DropdownInput data={statuses} value={status} setValue={setStatus} testID='status-dropdown' />
                </View>

                <View style={{ width: Size.width(88) }}>
                  <HeaderTextInput
                    headerText={'Quantity'}
                    onChangeText={(value) => setQuantity(value)}
                    inputWidth={Size.width(80)}
                    value={quantity}
                    testID='quantity-input'
                    isNumeric={true}
                  />
                </View>

                <View style={{ width: Size.width(88) }}>
                  <CustomTextHeader headerText="Unit" />
                  <DropdownInput data={units} value={unit} setValue={setUnit} testID='unit-dropdown' />
                </View>
              </View>

              {(userInfo && userInfo.is_master) &&
                <View style={styles.row}>
                  <View style={{ width: '100%' }}>
                    <CustomTextHeader headerText='School' />
                    <DropdownInput data={schoolList} value={school} setValue={setSchool} testID='school-dropdown' />
                  </View>
                </View>
              }

              {/* Room, cabinet, shelf number */}
              <View style={styles.row}>
                <HeaderTextInput
                  headerText={'Room'}
                  onChangeText={(value: string) => setRoom(value)}
                  inputWidth={Size.width(111)}
                  value={room}
                  testID="room-input"
                />
                <HeaderTextInput
                  headerText={'Cabinet'}
                  onChangeText={(value: string) => setCabinet(value)}
                  inputWidth={Size.width(88)}
                  isNumeric={true}
                  value={cabinet}
                  testID='cabinet-input'
                />
                <HeaderTextInput
                  headerText={'Shelf'}
                  onChangeText={(value: string) => setShelf(value)}
                  inputWidth={Size.width(88)}
                  isNumeric={true}
                  value={shelf}
                  testID='shelf-input'
                />
              </View>

              {/* SDS button */}
              <View style={{ marginTop: 10, marginBottom: 10 }}>
                <CustomTextHeader headerText={'SDS'} />
                <View style={{ alignItems: 'center' }}>
                  <CustomButton
                    title={uploaded ? uploadText : 'Upload'}
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
        </View>) : (<ErrorPage />)}
    </>
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
