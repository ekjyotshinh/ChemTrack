import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface ButtonProps {
  title: string;
  color?: string; // Optional color prop
  onPress: (event: GestureResponderEvent) => void;
  width?: number; // Optional width prop
}

export default function CustomButton({ title, onPress, color, width = 200 }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color || '#007AFF', width }]} 
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
