import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


const downloadQR = async (pdfUrl: string) => {
  try {
    const fileName = pdfUrl.split('/').pop(); // Extract the file name from the URL
    const tempUri = FileSystem.documentDirectory! + fileName;

    // Download the PDF file into the app's sandboxed directory
    const { uri } = await FileSystem.downloadAsync(pdfUrl, tempUri);
    console.log('Downloaded to:', uri);

    // Share the file (works in Expo Go)
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert('Download Complete', 'Open the Files app to find your PDF.');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Download Failed', 'Could not save the file.');
  }
};

export default downloadQR;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  controlsContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
    borderRadius: 8,
  },
  controlText: {
    color: 'white',
    fontSize: 18,
  },
  downloadButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    margin: 20,
    borderRadius: 8,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
