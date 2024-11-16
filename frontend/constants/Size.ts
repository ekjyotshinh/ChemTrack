import React from 'react'
import { Dimensions } from 'react-native'

// Figma prototype uses a 408x858 screen
// If we get the ratio of this and just multiply it by whatever
// pixel value is in Figma, it should scale properly

const figmaWidth = 408
const figmaHeight = 858

const widthRatio = Dimensions.get('screen').width / figmaWidth
const heightRatio = Dimensions.get('screen').height / figmaHeight

// Have these functions here to do the calculation automatically
// Also to prevent things from getting too small!
const Size = {
    width: (value: number) => Math.max(value * widthRatio, 10),
    height: (value: number) => Math.max(value * heightRatio, 10)
}

export default Size;
