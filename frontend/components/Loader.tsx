import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Modal } from 'react-native';

interface LoaderProps {
  message?: string;
  visible?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...', visible = true }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset the animation and start it again when the loader is visible
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [visible]); 

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 50,
    height: 50,
    borderWidth: 4,
    borderColor: '#fff',
    borderTopColor: 'transparent',
    borderRadius: 25,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Loader;
