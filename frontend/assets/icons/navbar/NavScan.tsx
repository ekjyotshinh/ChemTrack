import React from 'react';
import { View } from 'react-native';
import { Svg, Path, ClipPath, Defs, G, Rect } from 'react-native-svg';

const NavScan = ({ width = 40, height = 41, color = 'white' }) => (
    <View style={{ paddingBottom: 5 }}>
        <Svg width={width} height={height} viewBox="0 -1 40 41" fill="none">
            <G clipPath="url(#clip0_796_355)">
                <Path d="M4 3.66272C4 3.16544 4.21071 2.68853 4.58579 2.33689C4.96086 1.98526 5.46957 1.78772 6 1.78772H14C14.5304 1.78772 15.0391 1.98526 15.4142 2.33689C15.7893 2.68853 16 3.16544 16 3.66272V11.1627C16 11.66 15.7893 12.1369 15.4142 12.4885C15.0391 12.8402 14.5304 13.0377 14 13.0377H6C5.46957 13.0377 4.96086 12.8402 4.58579 12.4885C4.21071 12.1369 4 11.66 4 11.1627V3.66272Z" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M10 26.1627V26.1809" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M24 3.66272C24 3.16544 24.2107 2.68853 24.5858 2.33689C24.9609 1.98526 25.4696 1.78772 26 1.78772H34C34.5304 1.78772 35.0391 1.98526 35.4142 2.33689C35.7893 2.68853 36 3.16544 36 3.66272V11.1627C36 11.66 35.7893 12.1369 35.4142 12.4885C35.0391 12.8402 34.5304 13.0377 34 13.0377H26C25.4696 13.0377 24.9609 12.8402 24.5858 12.4885C24.2107 12.1369 24 11.66 24 11.1627V3.66272Z" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M10 7.41272V7.43088" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M4 22.4127C4 21.9154 4.21071 21.4385 4.58579 21.0869C4.96086 20.7353 5.46957 20.5377 6 20.5377H14C14.5304 20.5377 15.0391 20.7353 15.4142 21.0869C15.7893 21.4385 16 21.9154 16 22.4127V29.9127C16 30.41 15.7893 30.8869 15.4142 31.2385C15.0391 31.5902 14.5304 31.7877 14 31.7877H6C5.46957 31.7877 4.96086 31.5902 4.58579 31.2385C4.21071 30.8869 4 30.41 4 29.9127V22.4127Z" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M30 7.41272V7.43088" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M24 20.5377H30" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M36 20.5377V20.5559" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M24 20.5377V26.1627" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M24 31.7877H30" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M30 26.1627H36" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M36 26.1627V31.7877" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </G>
            <Defs>
                <ClipPath id="clip0_796_355">
                    <Rect width="40" height="40.3549" fill={color} transform="translate(0 0.03479)" />
                </ClipPath>
            </Defs>
        </Svg>
    </View>
);

export default NavScan;
