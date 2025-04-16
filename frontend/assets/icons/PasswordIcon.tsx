import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const PasswordIcon = ({ width = 24, height = 24, color = '#000000' }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Lock body */}
      <Rect
        x="6"
        y="11"
        width="12"
        height="9"
        rx="1"
        stroke={color}
        strokeWidth="2"
      />
      
      {/* Lock shackle */}
      <Path
        d="M8 11V7C8 4.79086 9.79086 3 12 3V3C14.2091 3 16 4.79086 16 7V11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Keyhole */}
      <Path
        d="M12 15V17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default PasswordIcon;