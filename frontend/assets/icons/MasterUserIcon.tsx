import React from 'react';
import { Svg, G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

const MasterUserIcon = ({ width = 24, height = 24, color = 'black' }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Defs>
            <ClipPath id="clip0_307_350">
                <Rect width="24" height="24" fill="white" />
            </ClipPath>
        </Defs>
        <G clipPath="url(#clip0_307_350)">
            <Path
                d="M12 6L16 12L21 8L19 18H5L3 8L8 12L12 6Z"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </G>
    </Svg>
);

export default MasterUserIcon;
