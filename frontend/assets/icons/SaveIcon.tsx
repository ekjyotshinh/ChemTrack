import React from 'react';
import { Svg, Path, Defs, G, Rect, ClipPath } from 'react-native-svg';



const SaveIcon = ({ width = 24, height = 24, color = 'white' }) => (

    <Svg width={width} height={height} viewBox="0 0 24 24" fill='none' >
        <G clipPath="url(#clip0_316_513)">
            <Path d="M6 4H16L20 8V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M10 14C10 14.5304 10.2107 15.0391 10.5858 15.4142C10.9609 15.7893 11.4696 16 12 16C12.5304 16 13.0391 15.7893 13.4142 15.4142C13.7893 15.0391 14 14.5304 14 14C14 13.4696 13.7893 12.9609 13.4142 12.5858C13.0391 12.2107 12.5304 12 12 12C11.4696 12 10.9609 12.2107 10.5858 12.5858C10.2107 12.9609 10 13.4696 10 14Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M14 4V8H8V4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </G>
        <Defs>
            <ClipPath id="clip0_316_513">
                <Rect width={width} height={height} fill={color} />
            </ClipPath>
        </Defs>
    </Svg>

);

export default SaveIcon;
