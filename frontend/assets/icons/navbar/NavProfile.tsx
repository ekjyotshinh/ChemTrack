import React from 'react';
import { Svg, Path } from 'react-native-svg';



const NavProfile = ({ width = 40, height = 43, color = 'white' }) => (

    <Svg width={width} height={height} viewBox="0 0 40 43" fill="none" >
        <Path fillRule="evenodd" clipRule="evenodd" d="M12.4999 9.5C12.4999 5.56497 15.8578 2.375 19.9999 2.375C24.1421 2.375 27.4999 5.56497 27.4999 9.5C27.4999 13.435 24.1421 16.625 19.9999 16.625C15.8578 16.625 12.4999 13.435 12.4999 9.5Z" fill={color} />
        <Path fillRule="evenodd" clipRule="evenodd" d="M6.25202 31.8334C6.38092 24.7247 12.4866 19 19.9999 19C27.5135 19 33.6193 24.7249 33.7479 31.8339C33.7564 32.3054 33.4705 32.737 33.0194 32.9337C29.0545 34.662 24.6441 35.625 20.0005 35.625C15.3564 35.625 10.9457 34.6618 6.98048 32.9332C6.52936 32.7365 6.24347 32.3049 6.25202 31.8334Z" fill={color} />
    </Svg>

);

export default NavProfile;
