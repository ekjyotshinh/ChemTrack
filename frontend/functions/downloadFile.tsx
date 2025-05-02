import React, { useState } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


const downloadFile = async (pdfUrl: string) => {
  try {
    const fileName = pdfUrl.split('/').pop(); // Extract the file name from the URL
    const tempUri = FileSystem.documentDirectory! + fileName;

    // Download the PDF file into the app's sandboxed directory
    const { uri } = await FileSystem.downloadAsync(pdfUrl, tempUri);
    //console.log('Downloaded to:', uri);

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

export default downloadFile;