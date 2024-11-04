import React from 'react';
import { Svg, Path, G, Defs, ClipPath, Rect } from 'react-native-svg';


const CalendarIcon = ({ width = 30, height = 30, color = 'white' }) => (

    <Svg width={width} height={height} viewBox="0 0 30 30" fill='none'>
        <G clip-path="url(#clip0_100_273)">
            <Path d="M5 8.75C5 8.08696 5.26339 7.45107 5.73223 6.98223C6.20107 6.51339 6.83696 6.25 7.5 6.25H22.5C23.163 6.25 23.7989 6.51339 24.2678 6.98223C24.7366 7.45107 25 8.08696 25 8.75V23.75C25 24.413 24.7366 25.0489 24.2678 25.5178C23.7989 25.9866 23.163 26.25 22.5 26.25H7.5C6.83696 26.25 6.20107 25.9866 5.73223 25.5178C5.26339 25.0489 5 24.413 5 23.75V8.75Z" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M20 3.75V8.75" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M10 3.75V8.75" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M5 13.75H25" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M8.75 17.5H8.76678" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M12.5125 17.5H12.5185" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M16.2625 17.5H16.2685" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M20.0188 17.5H20.0248" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M16.2688 21.25H16.2748" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M8.76245 21.25H8.76849" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M12.5125 21.25H12.5185" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </G>
        <Defs>
            <ClipPath id="clip0_100_273">
                <Rect width={width} height={height} fill={color} />
            </ClipPath>
        </Defs>
    </Svg>

);

export default CalendarIcon;
