import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import Header from '@/components/Header';
import CustomTextHeader from '@/components/inputFields/CustomTextHeader';
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
import BlueHeader from '@/components/BlueHeader';

export default function editChemicals() {
  const [name, setName] = useState<string>('');
  const [room, setRoom] = useState<string>('');
  const [shelf, setShelf] = useState<string>('');
  const [cabinet, setCabinet] = useState<string>('');
  const [school, setSchool] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [casParts, setCasParts] = useState<string[]>(['', '', '']);
  const [purchaseDate, setPurchaseDate] = useState<Date>();
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [editChemical, setEditChemical] = useState<any>(null);
  let sdsName: string = "placeholderName";

  const router = useRouter();
  const {id} = useLocalSearchParams();
    // Ensure chemicalId is a string
  const chemicalIdString = Array.isArray(id) ? id[0] : id;
  console.log(id)

  
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

    const replacePdf = async () => {
    try {
      // Get pdf
      const pickedPdf = await DocumentPicker.getDocumentAsync({
        multiple: false, // allow user to only select 1 file
        type: ["application/pdf"], // Restrict to pdfs only
        copyToCacheDirectory: false,
      });
      // if selection goes through
      if (!pickedPdf.canceled) {
        // Check success
        const successfulResult = pickedPdf as DocumentPicker.DocumentPickerSuccessResult;
        console.log('Got the pdf: ', pickedPdf);
        console.log('File assets: ', pickedPdf.assets); //file, lastModified, mimeType, name, size, uri;
        console.log('File Name: ', pickedPdf.assets[0].name);
        sdsName = pickedPdf.assets[0].name;
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

  // API URL
  const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;

  useEffect(() => {
    if (chemicalIdString) {
      fetchChemicalData(chemicalIdString);
    }
  }, [chemicalIdString]);

  // Fetch the chemical data from the API based on the chemicalId
  const fetchChemicalData = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/chemicals/${id}`);
      const data = await response.json();
      console.log(data)

      if (response.ok) {
        setEditChemical(data);
        setName(data.name || '');
        setRoom(data.room || '');
        setShelf(data.shelf?.toString() || '');
        setCabinet(data.cabinet?.toString() || '');
        setSchool(data.school || '');
        setStatus(data.status || '');
        setQuantity(data.quantity || '');
        setCasParts([
          data.CAS?.toString().substring(0, data.CAS?.toString().length - 3),  // First part: all digits except last 3
          data.CAS?.toString().substring(data.CAS?.toString().length - 3, data.CAS?.toString().length - 1),  // Second part: 2 digits before last digit
          data.CAS?.toString().substring(data.CAS?.toString().length - 1)  // Last part: last digit
        ]);
        
        setPurchaseDate(data.purchase_date ? new Date(data.purchase_date) : undefined);
        setExpirationDate(data.expiration_date ? new Date(data.expiration_date) : undefined);
        setUploaded(!!data.uploaded);
      } else {
        console.log('Failed to fetch chemical data:', data);
        Alert.alert('Error', 'Failed to fetch chemical data');
      }
    } catch (error) {
      console.error('Error fetching chemical data:', error);
      Alert.alert('Error', 'Error fetching chemical data');
    }
  };
    // Handle Back button press
  const handleBackPress = () => {
    router.push('/viewChemicals');                // Navigate back to the login page
  };

  // Handle form validation
  const stringInputs: string[] = [name, room, shelf, cabinet, school, status, quantity];
  const dateInputs: (Date | undefined)[] = [purchaseDate, expirationDate];
  const allInputs: any = [...stringInputs, ...dateInputs, ...casParts, uploaded];
  const [isFilled, setIsFilled] = useState<boolean>(false);

  useEffect(() => {
    const areStringsComplete: boolean = stringInputs.every(string => string.trim() !== '');
    const areDatesComplete: boolean = dateInputs.every(date => date !== undefined);
    const isCasComplete: boolean = casParts.every(string => string.trim() !== '');

    setIsFilled(areStringsComplete && areDatesComplete && isCasComplete && uploaded);
  }, allInputs);

  const onSave = async () => {
    if (isFilled) {
      const formatDate = (date: Date | null | undefined): string | undefined =>
        date ? date.toISOString().split('T')[0] : undefined;

      const data = {
        name,
        cas: parseInt(casParts.join(''), 10),
        school,
        purchase_date: formatDate(purchaseDate),
        expiration_date: formatDate(expirationDate),
        status,
        quantity,
        room,
        shelf: parseInt(shelf, 10),
        cabinet: parseInt(cabinet, 10),
      };

      try {
        const response = await fetch(
          `${API_URL}/api/v1/chemicals/${chemicalIdString}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }
        );

        const responseData = await response.json();

        if (response.ok) {
          console.log('Chemical updated successfully:', responseData);
          Alert.alert('Success', 'Chemical information updated');
          router.push('/');
        } else {
          console.log('Failed to update chemical:', responseData);
          Alert.alert('Error', 'Error occurred while updating chemical');
        }
      } catch (error) {
        console.error('Error updating chemical:', error);
        Alert.alert('Error', 'Error occurred while updating chemical');
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields!');
    }
  };

  const onClear = () => {
    setName('');
    setRoom('');
    setShelf('');
    setCabinet('');
    setSchool('');
    setStatus('');
    setQuantity('');
    setCasParts(['', '', '']);
    setPurchaseDate(undefined);
    setExpirationDate(undefined);
    setUploaded(false);
  };

  const onUpload = () => {
    setUploaded(!uploaded);
  };

  return (
    <View style={styles.container}>
      <BlueHeader headerText={name || 'Chemical Name'} onPress={handleBackPress} />
      <ScrollView style={styles.scroll}>
        <View style={styles.innerContainer}>
          {/* Name */}
          <HeaderTextInput headerText="Name" value={name} onChangeText={(value) => setName(value)} />
          {/* CAS Number */}
          <View style={{ marginTop: Size.width(10) }}>
            <CustomTextHeader headerText="CAS Number" />
            <CasTextBoxes casParts={casParts} setCasParts={setCasParts} />
          </View>

          {/* Purchase and Expiration Dates */}
          <View style={styles.row}>
            <DateInput date={purchaseDate} setDate={setPurchaseDate} inputWidth={Size.width(154)} headerText="Purchase Date" />
            <DateInput date={expirationDate} setDate={setExpirationDate} inputWidth={Size.width(154)} headerText="Expiration Date" />
          </View>

          {/* Status and Quality */}
          <View style={styles.row}>
            <View style={{ width: Size.width(154) }}>
              <CustomTextHeader headerText="Status" />
              <DropdownInput data={statuses} value={status} setValue={setStatus} />
            </View>

            <View style={{ width: Size.width(154) }}>
              <CustomTextHeader headerText="Quantity" />
              <DropdownInput data={quantities} value={quantity} setValue={setQuantity} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{width: '100%'}}>
              <CustomTextHeader headerText="School" />
              <DropdownInput data={schools} value={school} setValue={setSchool} />
            </View>
          </View>

          {/* Room, cabinet, shelf number */}
          <View style={styles.row}>
            <HeaderTextInput headerText="Room" onChangeText={(value) => setRoom(value)} inputWidth={Size.width(111)} value={room} />
            <HeaderTextInput headerText="Cabinet" onChangeText={(value) => setCabinet(value)} inputWidth={Size.width(88)} isNumeric value={cabinet} />
            <HeaderTextInput headerText="Shelf" onChangeText={(value) => setShelf(value)} inputWidth={Size.width(88)} isNumeric value={shelf} />
          </View>

          {/* SDS button */}
          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <CustomTextHeader headerText="SDS" />
            <View style={{ alignItems: 'center' }}>
              <CustomButton
                title={uploaded ? 'File Uploaded' : 'Replace PDF'}
                onPress={replacePdf}
                width={337}
                icon={uploaded ? <ResetIcon width={24} height={24} color="white" /> : <UploadIcon width={24} height={24} />}
                iconPosition="left"
                color={uploaded ? 'black' : 'white'}
                textColor={uploaded ? 'white' : 'black'}
              />
            </View>
          </View>

          <View style={{ alignItems: 'center' }}>
            {/* Save and Clear buttons */}
            <CustomButton
              title="Save Chemical"
              textColor={isFilled ? 'white' : Colors.grey}
              color={isFilled ? Colors.blue : 'white'}
              onPress={onSave}
              width={337}
              icon={<SaveIcon width={24} height={24} color={isFilled ? 'white' : Colors.grey} />}
              iconPosition="left"
            />

            <CustomButton
              title="Clear"
              onPress={onClear}
              width={337}
              icon={<ReturnIcon width={24} height={24} />}
              iconPosition="left"
              color={Colors.red}
              textColor="white"
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
