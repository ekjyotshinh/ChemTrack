import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import CustomTextHeader from '@/components/inputFields/CustomTextHeader';
import CasTextBoxes from '@/components/inputFields/CasTextBoxes';
import UploadIcon from '@/assets/icons/UploadIcon';
import SaveIcon from '@/assets/icons/SaveIcon';
import DateInput from '@/components/inputFields/DateInput';
import DropdownInput from '@/components/inputFields/DropdownInput';
import ResetIcon from '@/assets/icons/ResetIcon';
import Colors from '@/constants/Colors';
import Size from '@/constants/Size';
import * as DocumentPicker from 'expo-document-picker';
import BlueHeader from '@/components/BlueHeader';
import { useUser } from '@/contexts/UserContext';
import ErrorPage from './errorPage';
import fetchSchoolList from '@/functions/fetchSchool';
import TrashIcon from '@/assets/icons/TrashIcon';



export default function EditChemicals() {
  const [name, setName] = useState<string>('');
  const [room, setRoom] = useState<string>('');
  const [shelf, setShelf] = useState<string>('');
  const [cabinet, setCabinet] = useState<string>('');
  const [school, setSchool] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [casParts, setCasParts] = useState<string[]>(['', '', '']);
  const [purchaseDate, setPurchaseDate] = useState<Date>();
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [changedPdf, setChangedPdf] = useState<boolean>(false);
  const [editChemical, setEditChemical] = useState<any>(null);

  const router = useRouter();
  const { id } = useLocalSearchParams();
  const chemicalIdString = Array.isArray(id) ? id[0] : id;
  const { userInfo } = useUser();
  const [uploadText, setUploadText] = useState<string>('');
  const sdsForm = useRef<FormData | null>(null);

  const [schoolList, setSchoolList] = useState<any>([{ label: '', value: '' }]);

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

  const replacePdf = async () => {
    if (!(userInfo && (userInfo.is_admin || userInfo.is_master))) return;
    try {
      // Get pdf
      const pickedPdf = await DocumentPicker.getDocumentAsync({
        multiple: false, // allow user to only select 1 file
        type: ["application/pdf"], // Restrict to pdfs only
        copyToCacheDirectory: false,
      });
      // if selection goes through
      if (pickedPdf && !pickedPdf.canceled) {
        // Check success
        const successfulResult = pickedPdf as DocumentPicker.DocumentPickerSuccessResult;
        console.log('Got the pdf: ', pickedPdf);
        console.log('File assets: ', pickedPdf.assets); //file, lastModified, mimeType, name, size, uri;
        console.log('File Name: ', pickedPdf.assets[0].name);
        sdsForm.current = new FormData();
        sdsForm.current.append('sds', {
          uri: pickedPdf.assets[0].uri,
          name: pickedPdf.assets[0].name,
          type: pickedPdf.assets[0].mimeType,
        } as any);
        setUploadText(pickedPdf.assets[0].name);
        setUploaded(true);
        setChangedPdf(true);
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

  // Fetch every time this page comes into focus
  // Fixes issue of a user selecting a chemical, making edits, leaving the page, then selecting  // the same chemical and still seeing the edited version rather than what's in the database

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
        const quantityArray = data.quantity ? data.quantity.split(' ') : ['', ''];
        setQuantity(quantityArray[0] || '');
        setUnit(quantityArray[1] || '');
        setCasParts([
          data.CAS?.toString().substring(0, data.CAS?.toString().length - 3),  // First part: all digits except last 3
          data.CAS?.toString().substring(data.CAS?.toString().length - 3, data.CAS?.toString().length - 1),  // Second part: 2 digits before last digit
          data.CAS?.toString().substring(data.CAS?.toString().length - 1)  // Last part: last digit
        ]);

        setPurchaseDate(data.purchase_date ? new Date(data.purchase_date) : undefined);
        setExpirationDate(data.expiration_date ? new Date(data.expiration_date) : undefined);
        setUploaded(!!data.sdsURL);
      } else {
        console.log('Failed to fetch chemical data:', data);
        Alert.alert('Error', 'Failed to fetch chemical data');
      }
    } catch (error) {
      console.error('Error fetching chemical data:', error);
      Alert.alert('Error', 'Error fetching chemical data');
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (chemicalIdString && userInfo && (userInfo.is_admin || userInfo.is_master)) {
        fetchChemicalData(chemicalIdString);
        // Only fetch school list if user is master
        if (userInfo.is_master) {
          fetchSchoolList({ setSchoolList });
        }
      }
    }, [chemicalIdString])
  );

  // Handle Back button press
  const handleBackPress = () => {
    router.push('/viewChemicals'); // Navigate back to the login page
  };

  // Handle form validation
  const stringInputs: string[] = [name, room, shelf, cabinet, school, status, quantity, unit];
  const dateInputs: (Date | undefined)[] = [purchaseDate, expirationDate];
  const allInputs: any = [...stringInputs, ...dateInputs, ...casParts, uploaded];
  const [isFilled, setIsFilled] = useState<boolean>(false);

  useEffect(() => {
    const areStringsComplete = [name, room, shelf, cabinet, school, status, quantity, unit].every(s => s.trim() !== '');
    const areDatesComplete = [purchaseDate, expirationDate].every(date => date !== undefined);
    const isCasComplete = Array.isArray(casParts) && casParts.every(part => part && part.trim() !== '');

    const filled = areStringsComplete && areDatesComplete && isCasComplete && uploaded;
    if (isFilled !== filled) {
      setIsFilled(filled);
    }
  }, [name, room, shelf, cabinet, school, status, quantity, unit, purchaseDate, expirationDate, casParts.join(''), uploaded]);

  const onSave = async () => {
    if (isFilled && userInfo && (userInfo.is_admin || userInfo.is_master)) {
      const formatDate = (date: Date | null | undefined): string | undefined =>
        date ? date.toISOString().split('T')[0] : undefined;

      const data = {
        name,
        cas: parseInt(casParts.join(''), 10),
        school,
        purchase_date: formatDate(purchaseDate),
        expiration_date: formatDate(expirationDate),
        status,
        quantity: [quantity, unit].filter(Boolean).join(' '),
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
          if (changedPdf) {
            const pdfResponse = await fetch(`${API_URL}/api/v1/files/sds/${responseData.chemical.id}`, {
              method: 'POST',
              body: sdsForm.current!,
            });
            if (!pdfResponse.ok) {
              console.log('Failed to update pdf:', sdsForm.current);
              Alert.alert('Error', 'Error occurred while updating Pdf');
            } else {
              console.log('Chemical and SDS updated successfully:', responseData, sdsForm.current);
              Alert.alert('Success', 'Chemical and SDS information updated');
              router.push('/');
            }
          } else {
            console.log('Chemical updated successfully:', responseData);
            Alert.alert('Success', 'Chemical information updated');
            router.push('/');
          }
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

  // Show delete alert pop up to confirm user's action
  const onDelete = async () => {
    Alert.alert(
      'Delete Chemical?',
      'This action cannot be reversed.',
      [
        {
          text: 'Cancel',

        },

        {
          text: 'Delete',
          onPress: () => handleDelete(),
        },
      ]
    );
  };

  // Handles the actual deletion of the chemical
  const handleDelete = async () => {
    if (!(userInfo && (userInfo.is_admin || userInfo.is_master))) {
      Alert.alert('Error', 'You don\'t have permissions');
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/v1/chemicals/${chemicalIdString}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const sdsResponse = await fetch(
        `${API_URL}/api/v1/files/sds/${chemicalIdString}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }

      );

      const responseData = await response.json();
      const sdsResponseData = await sdsResponse.json();

      if (response.ok) {
        Alert.alert('Success', 'Chemical successfully deleted');
        router.push('/');
      } else {
        console.log('Failed to delete chemical:', responseData);
        Alert.alert('Error', 'Error occurred while deleting chemical');
      }
    } catch (error) {
      console.error('Error deleting chemical:', error);
      Alert.alert('Error', 'Error occurred while deleting chemical');
    }
  };

  const onUpload = () => {
    setUploaded(!uploaded);
  };

  return (
    <>
      {userInfo && (userInfo.is_admin || userInfo.is_master) ? (
        <View style={styles.container}>
          <BlueHeader headerText={name || 'Chemical Name'} onPress={handleBackPress} />
          <Text>Edit Chemical</Text>
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
                <CustomTextHeader headerText="CAS Number" />
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
                  <CustomTextHeader headerText="Status" />
                  <DropdownInput data={statuses} value={status} setValue={setStatus} testID='status-dropdown' />
                </View>

                <View style={{ width: Size.width(88) }}>
                  <HeaderTextInput
                    headerText="Quantity"
                    onChangeText={(value) => setQuantity(value)}
                    inputWidth={Size.width(80)}
                    isNumeric value={quantity}
                    testID='quantity-input'
                  />
                </View>

                <View style={{ width: Size.width(88) }}>
                  <CustomTextHeader headerText="Unit" />
                  <DropdownInput
                    data={units}
                    value={unit}
                    setValue={setUnit}
                    testID="unit-dropdown" />
                </View>
              </View>

              {userInfo && userInfo.is_master &&
                <View style={styles.row}>
                  <View style={{ width: '100%' }}>
                    <CustomTextHeader headerText="School" />
                    <DropdownInput data={schoolList} value={school} setValue={setSchool} testID='school-dropdown' />
                  </View>
                </View>
              }

              {/* Room, cabinet, shelf number */}
              <View style={styles.row}>
                <HeaderTextInput headerText="Room"
                  onChangeText={(value) => setRoom(value)}
                  inputWidth={Size.width(111)}
                  value={room}
                  testID='room-input'
                />
                <HeaderTextInput
                  headerText="Cabinet"
                  onChangeText={(value) => setCabinet(value)}
                  inputWidth={Size.width(88)}
                  isNumeric value={cabinet}
                  testID='cabinet-input'
                />
                <HeaderTextInput
                  headerText="Shelf"
                  onChangeText={(value) => setShelf(value)}
                  inputWidth={Size.width(88)}
                  isNumeric value={shelf}
                  testID='shelf-input'
                />
              </View>

              {/* SDS button */}
              <View style={{ marginTop: 10, marginBottom: 10 }}>
                <CustomTextHeader headerText="SDS" />
                <View style={{ alignItems: 'center' }}>
                  <CustomButton
                    title={uploaded ? 'File Uploaded' : 'Replace PDF'}
                    onPress={replacePdf}
                    width={337}
                    icon={uploaded ? <ResetIcon width={24} height={24} color="white" /> :
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
                  title="Save Chemical"
                  textColor={isFilled ? 'white' : Colors.grey}
                  color={isFilled ? Colors.blue : 'white'}
                  onPress={onSave}
                  width={337}
                  icon={<SaveIcon width={24} height={24} color={isFilled ? 'white' : Colors.grey} />}
                  iconPosition="left"
                />

                <CustomButton
                  title="Delete Chemical"
                  onPress={onDelete}
                  width={337}
                  icon={<TrashIcon width={24} height={24} />}
                  iconPosition="left"
                  color={Colors.red}
                  textColor="white"
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
