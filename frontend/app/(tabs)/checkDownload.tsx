import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export default function CheckDownload() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  const tempUri = FileSystem.documentDirectory + 'qr-code.pdf';

  const downloadPDF = async () => {
    try {
      // Download the PDF file
      const { uri } = await FileSystem.downloadAsync(pdfUrl, tempUri);
      console.log('Downloaded to:', uri);

      if (Platform.OS === 'android') {
        // Request permission to save the file
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Storage access is required to save the file.');
          return;
        }

        // Move file to the Downloads folder
        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.getAlbumAsync('Download');

        if (album == null) {
          await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }

        Alert.alert('Download Complete', 'PDF saved to Downloads folder.');
        console.log('File moved to Downloads');
      } else {
        // On iOS, use Sharing to let the user save the file manually
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Download Complete', 'Open the Files app to find your PDF.');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Download Failed', 'Could not save the file.');
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Loading permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Camera Permission" />
        <TouchableOpacity style={styles.downloadButton} onPress={downloadPDF}>
          <Text style={styles.downloadButtonText}>Download QR Code PDF</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} />
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setFacing((prev) => (prev === 'back' ? 'front' : 'back'))}
        >
          <Text style={styles.controlText}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.downloadButton} onPress={downloadPDF}>
        <Text style={styles.downloadButtonText}>Download QR Code PDF</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    fontSize: 16,
    marginBottom: 20
  },
  camera: {
    flex: 1,
    width: '100%'
  },
  controlsContainer: {
    position: 'absolute',
    top: 40,
    left: 20
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
    borderRadius: 8
  },
  controlText: {
    color: 'white',
    fontSize: 18
  },
  downloadButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    margin: 20,
    borderRadius: 8
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 18
  }
});
