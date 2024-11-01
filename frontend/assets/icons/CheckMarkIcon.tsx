import React from 'react';
import { Svg, Path, Defs, ClipPath, Rect, G } from 'react-native-svg';

const CheckmarkIcon = ({ width = 24, height = 24, color = 'white' }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Defs>
            <ClipPath id="clip0">
                <Rect width="24" height="24" fill="white" />
            </ClipPath>
        </Defs>
        <G clipPath="url(#clip0)">
            <Path 
                d="M5 12L10 17L20 7" 
                stroke={color} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
        </G>
    </Svg>
);

export default CheckmarkIcon;
