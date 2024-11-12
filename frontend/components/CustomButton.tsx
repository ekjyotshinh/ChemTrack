import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, Dimensions, View } from 'react-native';
import TextInter from './TextInter';
import Size from '@/constants/Size';

interface ButtonProps {
  title: string;
  color?: string; // Optional color prop
  textColor?: string; // Optional text color prop
  onPress: (event: GestureResponderEvent) => void;
  width: number; // Width prop
  icon?: React.ReactNode; // Icon as a React Node
  iconPosition?: 'left' | 'right'; // Position of the icon
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CustomButton({
  title,
  onPress,
  color,
  textColor,
  width,
  icon,
  iconPosition = 'left', // Default icon position
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color || '#007AFF', width: Size.width(width), height: Size.height(59), }]}
      onPress={onPress}
    >
      {icon && iconPosition === 'left' && (
        <View style={[styles.iconContainer, { left: Size.width(24) }]}>
          {icon}
        </View>
      )}
      
      <TextInter style={[styles.buttonText, {color: textColor || 'white'}]}>{title}</TextInter>
      
      {icon && iconPosition === 'right' && (
        <View style={[styles.iconContainer, { right: Size.width(24) }]}>
          {icon}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Size.height(15),
    borderRadius: 10,
    marginVertical: Size.height(10),
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center', 
    position: 'relative', 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2, 
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Ensure text stays centered
  },
  iconContainer: {
    position: 'absolute', // Absolutely position the icon
  },
});
