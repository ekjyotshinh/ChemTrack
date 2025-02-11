/*
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

export default function CheckDownload() {
const [facing, setFacing] = useState<CameraType>('back');
const [permission, requestPermission] = useCameraPermissions();

// Replace with your image URL when available
const imageUrl = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fblog.tcea.org%2Fchrome-qr-code-generator%2F&psig=AOvVaw2uNlLkyCc8yFTDM3StS14K&ust=1739260018084000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLCfzdDOuIsDFQAAAAAdAAAAABAP';
const fileUri = FileSystem.documentDirectory + 'downloadedImage.jpg';

const downloadImage = async () => {
try {
const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
Alert.alert('Download Success', 'Image downloaded to: ' + uri);
console.log('Finished downloading to', uri);
} catch (error) {
console.error(error);
Alert.alert('Download Error', 'An error occurred while downloading the image.');
}
};

if (!permission) {
// Permissions are still loading.
return (
<View style={styles.container}>
<Text>Loading permissions...</Text>
</View>
);
}

if (!permission.granted) {
// When permissions are not granted, show the permission request UI along with the download functionality.
return (
<View style={styles.container}>
<Text style={styles.message}>We need your permission to show the camera.</Text>
<Button onPress={requestPermission} title="Grant Camera Permission" />
<TouchableOpacity style={styles.downloadButton} onPress={downloadImage}>
<Text style={styles.downloadButtonText}>Download QR Code</Text>
</TouchableOpacity>
</View>
);
}

// When camera permission is granted, show the camera view and the download button separately.
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
<TouchableOpacity style={styles.downloadButton} onPress={downloadImage}>
<Text style={styles.downloadButtonText}>Download QR Code</Text>
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
*/

import React, { useState } from 'react';  
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';  
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';  
import * as FileSystem from 'expo-file-system';  

export default function CheckDownload() {  
  const [facing, setFacing] = useState<CameraType>('back');  
  const [permission, requestPermission] = useCameraPermissions();  

  // Replace with your actual PDF URL  
  const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'; 
  const fileUri = FileSystem.documentDirectory + 'qr-code.pdf';  

  const downloadPDF = async () => {  
    try {  
      const { uri } = await FileSystem.downloadAsync(pdfUrl, fileUri);  
      Alert.alert('Download Complete', 'PDF saved to device storage');  
      console.log('File saved at:', uri);  
    } catch (error) {  
      console.error(error);  
      Alert.alert('Download Failed', 'Could not download PDF');  
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