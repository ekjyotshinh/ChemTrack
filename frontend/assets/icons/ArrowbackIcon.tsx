import React from 'react';
import { Svg, Path } from 'react-native-svg';

const ArrowRightIcon = ({ width = 28, height = 28, color = 'white' }) => (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
        <Path d="M18.8708 12.8333L12.3375 6.29998L14 4.66665L23.3333 14L14 23.3333L12.3375 21.7L18.8708 15.1666H4.66668V12.8333H18.8708Z" fill={color} />
    </Svg>
);

export default ArrowRightIcon;
