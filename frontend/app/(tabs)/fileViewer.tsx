import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Platform, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";
import Header from '@/components/Header';

export default function PdfViewer() {
  const { fileUrl, title } = useLocalSearchParams(); 

  const fileUrlUpdated = Array.isArray(fileUrl) ? fileUrl[0] : fileUrl;
  const titleNameUpdated = Array.isArray(title) ? title.join(" ") : title;


  const [loading, setLoading] = useState(true); 
  const [key, setKey] = useState(0); 

  useEffect(() => {
    setKey(prevKey => prevKey + 1); 
  }, [fileUrlUpdated, titleNameUpdated]);

  const handleWebViewLoad = () => {
    setLoading(false); 
  };

  if (!fileUrlUpdated || !titleNameUpdated) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.errorText}>
          Missing PDF URL or chemical name. Unable to load the document.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header headerText={titleNameUpdated} />

      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      )}

      <View style={styles.pdfContainer}>  
        <WebView 
          key={key}
          source={{ 
            uri: Platform.OS === 'ios' 
              ? fileUrlUpdated 
              : `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrlUpdated)}` 
          }} 
          style={styles.webView} 
          startInLoadingState={true} 
          renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
          originWhitelist={['*']}
          cacheEnabled={false}
          onLoad={handleWebViewLoad}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  pdfContainer: {
    flex: 1,
    marginHorizontal: 10, 
    marginTop: 120, // header is 117
    marginBottom: 20, 
    borderRadius: 10, 
    overflow: 'hidden', 
  },
  webView: {
    flex: 1,
    borderRadius: 10,
  },
});
