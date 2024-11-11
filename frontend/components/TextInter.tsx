import { Text, TextStyle, StyleSheet } from 'react-native'
import { TextProps } from 'react-native';

interface TextInterface extends TextProps {
    style?: TextStyle | TextStyle[];
}

// Use this instead of <Text> so we can use Inter font
// Wanted to make it as easy as possible for people to use
// Basically just use this like you would <Text> and it should work!
const TextInter = ({ style, ...props } : TextInterface) => {

    // The issue is that we cannot apply bold to custom fonts and if
    // we do, THE FONT WILL NOT WORK ON ANDROID!

    // To solve this, we manually get the styles applied and check
    // what the fontWeight is.

    // Depending on the fontWeight, we will switch the font to the
    // appropriate Inter font and discard the fontWeight property.
    const fontWeightHashTable: { [key: string]: string } = {
        "100": "Inter_100Thin",
        "200": "Inter_200ExtraLight",
        "300": "Inter_300Light",
        "400": "Inter_400Regular",
        "500" : "Inter_500Medium",
        "600": "Inter_600SemiBold",
        "700": "Inter_700Bold",
        "800": "Inter_800ExtraBold",
        "900": "Inter_900Black",

        "thin": "Inter_100Thin",
        "extralight": "Inter_200ExtraLight",
        "light": "Inter_300Light",
        "regular": "Inter_400Regular",
        "medium" : "Inter_500Medium",
        "semibold": "Inter_600SemiBold",
        "bold": "Inter_700Bold",
        "heavy": "Inter_800ExtraBold",
        "black": "Inter_900Black"

      };


    const flattenedStyles = StyleSheet.flatten(style)
    const { fontWeight, ...restStyle } = flattenedStyles
    const fontFamily = fontWeightHashTable[fontWeight ?? '400']

    return (
        <Text 
            {...props}
            style={[
                restStyle,
                { fontFamily }
            ]}
        />
    )
}

export default TextInter;