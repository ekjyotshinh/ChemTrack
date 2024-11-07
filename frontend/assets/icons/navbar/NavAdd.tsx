import React from 'react';
import { Svg, Path, ClipPath, Defs, G, Rect } from 'react-native-svg';



const NavAdd = ({ width = 40, height = 40, color = 'white' }) => (

    <Svg width={width} height={height} viewBox="0 0 40 42" fill="none">
        <G clip-path="url(#clip0_796_373)">
            <Path d="M20 2.28772V34.3711" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3.77271 18.7877H36.2273" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </G>
        <Defs>
            <ClipPath id="clip0_796_373">
                <Rect width="40" height="41.3896" fill={color} />
            </ClipPath>
        </Defs>
    </Svg>

);

export default NavAdd;