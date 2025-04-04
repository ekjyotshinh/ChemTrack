import React from 'react';
import { Svg, Path, Defs, ClipPath, Rect, G } from 'react-native-svg';

const DescendingSortIcon = ({ width = 24, height = 24, color = 'black' }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Defs>
            <ClipPath id="clip0_285_607">
                <Rect width="24" height="24" fill="white" />
            </ClipPath>
        </Defs>
        <G clipPath="url(#clip0_285_607)">
            <Path
                d="M4 6H13"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M4 12H11"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M4 18H11"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15 15L18 18L21 15"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M18 6V18"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </G>
    </Svg>
);

export default DescendingSortIcon;
