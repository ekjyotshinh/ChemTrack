import React from 'react';
import { Svg, Path, Defs, ClipPath, Rect, G } from 'react-native-svg';

const AscendingSortIcon = ({ width = 24, height = 24, color = 'white' }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Defs>
            <ClipPath id="clip0_285_617">
                <Rect width="24" height="24" fill="white" />
            </ClipPath>
        </Defs>
        <G clipPath="url(#clip0_285_617)">
            <Path
                d="M4 6H11"
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
                d="M4 18H13"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15 9L18 6L21 9"
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

export default AscendingSortIcon;
