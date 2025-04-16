import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, Dimensions, View } from 'react-native';
import TextInter from './TextInter';
import Size from '@/constants/Size';
import Colors from '@/constants/Colors';

interface ButtonProps {
  title: string;
  color?: string; // Optional color prop
  textColor?: string; // Optional text color prop
  onPress: (event: GestureResponderEvent) => void;
  width: number; // Width prop
  icon?: React.ReactNode; // Icon as a React Node
  iconPosition?: 'left' | 'right'; // Position of the icon
  fontSize?: number;
  height?: number;
  isSpaceBetween?: boolean;
  disabled?: boolean; // Added disabled prop
}

export default function CustomButton({
  title,
  onPress,
  color,
  textColor,
  width,
  height = 59,
  icon,
  iconPosition = 'left', // Default icon position
  fontSize = 16,
  isSpaceBetween = false,
  disabled = false, // Default value for disabled
}: ButtonProps) {

  const justyBtnContent = isSpaceBetween ? 'space-between' : 'center';
  // Calculate opacity based on disabled state
  const buttonOpacity = disabled ? 0.6 : 1;

  return (
    <TouchableOpacity
      style={
        [styles.button, 
          { 
            backgroundColor: color || Colors.blue, 
            width: Size.width(width), 
            height: Size.height(height), 
            justifyContent: justyBtnContent,
            opacity: buttonOpacity // Apply opacity when disabled
          }]}
      onPress={onPress}
      disabled={disabled} // Add the disabled prop to TouchableOpacity
      activeOpacity={0.8}
    >
      {icon && iconPosition === 'left' && (
        <View style={[styles.iconContainer, { left: Size.width(24) }]}>
          {icon}
        </View>
      )}
      
      <TextInter 
      style={
        [styles.buttonText, 
          {color: textColor || Colors.white, fontSize: fontSize}, 
          isSpaceBetween && iconPosition === 'left' ? { marginRight: Size.width(24) } : {}, 
          isSpaceBetween && iconPosition === 'right' ? { marginLeft: Size.width(24) } : {}
        ]}>{title}</TextInter>
      
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
    alignItems: 'center', 
    position: 'relative', 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2, 
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center', // Ensure text stays centered
  },
  iconContainer: {
    position: 'absolute', // Absolutely position the icon
  },
});