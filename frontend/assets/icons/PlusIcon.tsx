import React from 'react';
import Svg, { Path, G, SvgProps } from 'react-native-svg';

const PlusIcon = ({ width = 24, height = 24, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 55 61" fill="none">
    <G clipPath="url(#clip0_153_194)">
      <Path d="M27.5 11V43.0833" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M11.4583 27.5H43.5417" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </G>
  </Svg>
);

export default PlusIcon;