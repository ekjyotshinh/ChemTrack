import React from 'react';
import { Svg, G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

const AdminUserIcon = ({ width = 24, height = 24, color = 'black' }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Defs>
            <ClipPath id="clip0_307_353">
                <Rect width="24" height="24" fill="white" />
            </ClipPath>
        </Defs>
        <G clipPath="url(#clip0_307_353)">
            <Path
                d="M4 20.0001H8L18.5 9.50006C18.7626 9.23741 18.971 8.92561 19.1131 8.58245C19.2553 8.23929 19.3284 7.87149 19.3284 7.50006C19.3284 7.12862 19.2553 6.76083 19.1131 6.41767C18.971 6.07451 18.7626 5.7627 18.5 5.50006C18.2374 5.23741 17.9256 5.02907 17.5824 4.88693C17.2392 4.74479 16.8714 4.67163 16.5 4.67163C16.1286 4.67163 15.7608 4.74479 15.4176 4.88693C15.0744 5.02907 14.7626 5.23741 14.5 5.50006L4 16.0001V20.0001Z"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M13.5 6.5L17.5 10.5"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M16 19H22"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M19 16V22"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </G>
    </Svg>
);

export default AdminUserIcon;
