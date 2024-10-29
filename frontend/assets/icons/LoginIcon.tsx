import React from 'react';
import { Svg, Path, Defs, ClipPath, Rect, G } from 'react-native-svg';



const LoginIcon = ({ width = 24, height = 24, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Defs>
      <ClipPath id="clip0">
        <Rect width="24" height="24" fill="white" />
      </ClipPath>
    </Defs>
    <G clipPath="url(#clip0)">
      <Path 
        d="M15 8V6C15 5.46957 14.7893 4.96086 14.4142 4.58579C14.0391 4.21071 13.5304 4 13 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H13C13.5304 20 14.0391 19.7893 14.4142 19.4142C14.7893 19.0391 15 18.5304 15 18V16" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <Path 
        d="M21 12H8L11 9" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <Path 
        d="M11 15L8 12" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </G>
  </Svg>
);

export default LoginIcon;
