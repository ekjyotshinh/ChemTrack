import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, Dimensions, View } from 'react-native';

interface ButtonProps {
  title: string;
  color?: string; // Optional color prop
  onPress: (event: GestureResponderEvent) => void;
  width: number; // Width prop
  icon?: React.ReactNode; // Icon as a React Node
  iconPosition?: 'left' | 'right'; // Position of the icon
}

const { width: screenWidth } = Dimensions.get('window');

export default function CustomButton({
  title,
  onPress,
  color,
  width,
  icon,
  iconPosition = 'left', // Default icon position
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color || '#007AFF', width: (width / 100) * screenWidth }]}
      onPress={onPress}
    >
      {icon && iconPosition === 'left' && (
        <View style={[styles.iconContainer, { left: 10 }]}>
          {icon}
        </View>
      )}
      
      <Text style={styles.buttonText}>{title}</Text>
      
      {icon && iconPosition === 'right' && (
        <View style={[styles.iconContainer, { right: 10 }]}>
          {icon}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center', 
    position: 'relative', 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Ensure text stays centered
  },
  iconContainer: {
    position: 'absolute', // Absolutely position the icon
  },
});
