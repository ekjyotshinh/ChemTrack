import React from 'react';
import { View } from 'react-native';
import { Svg, Path, ClipPath, Defs, G, Rect } from 'react-native-svg';

const NavView = ({ width = 41, height = 44, color = 'white' }) => (
    <View style={{ paddingBottom: 5 }}>
        <Svg width={width} height={height} viewBox="0 2 41 44" fill="none">
            <Path d="M20.5 27.5C23.3305 27.5 25.625 25.0376 25.625 22C25.625 18.9624 23.3305 16.5 20.5 16.5C17.6695 16.5 15.375 18.9624 15.375 22C15.375 25.0376 17.6695 27.5 20.5 27.5Z" fill={color} />
            <Path fillRule="evenodd" clipRule="evenodd" d="M2.26083 20.9856C4.80155 12.7888 12.006 6.875 20.5009 6.875C28.9918 6.875 36.1935 12.7833 38.7374 20.9742C38.943 21.6361 38.9432 22.3523 38.738 23.0144C36.1972 31.2112 28.9928 37.125 20.4979 37.125C12.007 37.125 4.80526 31.2167 2.26139 23.0258C2.0558 22.3639 2.05561 21.6477 2.26083 20.9856ZM29.4688 22C29.4688 27.3157 25.4533 31.625 20.5 31.625C15.5467 31.625 11.5312 27.3157 11.5312 22C11.5312 16.6843 15.5467 12.375 20.5 12.375C25.4533 12.375 29.4688 16.6843 29.4688 22Z" fill={color} />
        </Svg>
    </View>
);

export default NavView;