import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import ChemicalDetails from '@/components/viewChemicalModals/ChemicalDetails';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';

export default function ViewChemicals() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sdsUrl, setSdsUrl] = useState('');
  const [isSDSBottomSheetOpen, setIsSDSBottomSheetOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();
  const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;
  const viewPdf = async (pdfUrl: string) => {
    console.log('Opening PDF:', pdfUrl);
    try {
      router.push({
        pathname: '/fileViewer',
        params: { pdfUrl }
      });
    }
    // For other errors besides responses
    catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error occured');
    };
  };
  const toggleSDSBottomSheet = () => {
    setIsSDSBottomSheetOpen(!isSDSBottomSheetOpen);
    viewPdf(sdsUrl);
  };
  const fetchChemicalData = async (id: string) => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/chemicals/${id}`);
      const data = await response.json();
      if (response.ok) {
        setSelectedChemical(data);
        setModalVisible(true);
        setSdsUrl(data.sdsURL);
      } else {
        console.log('Failed to fetch chemical data:', data);
        Alert.alert('Error', 'Failed to fetch chemical data');
      }
    } catch (error) {
      console.log('Error fetching chemical data:', error);
      Alert.alert('Error', 'Invalid QR or Error fetching chemical data');
    } finally {
      setIsFetching(false);
    }
  };
  const closeModal = () => {
    setScannedData(null);
    setModalVisible(false);
  };
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }



  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} onBarcodeScanned={({ data }) => {
        if (!modalVisible && data !== scannedData) {
          setScannedData(data);
          fetchChemicalData(data);
        }
      }}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      <ChemicalDetails
        selectedChemical={selectedChemical}
        toggleSDSBottomSheet={toggleSDSBottomSheet}
        modalVisible={modalVisible}
        closeModal={closeModal}
        router={router}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
