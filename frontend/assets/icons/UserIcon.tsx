import React from 'react';
import { Svg, Path } from 'react-native-svg';



const UserIcon = ({ width = 24, height = 24, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 49 51" fill={color} >
    <Path fillRule="evenodd" clipRule="evenodd" d="M17.125 9.75C17.125 5.71142 20.6508 2.4375 25 2.4375C29.3493 2.4375 32.875 5.71142 32.875 9.75C32.875 13.7886 29.3493 17.0625 25 17.0625C20.6508 17.0625 17.125 13.7886 17.125 9.75Z" fill={color}/>
    <Path fillRule="evenodd" clipRule="evenodd" d="M10.5647 32.6712C10.7001 25.3753 17.111 19.5 25 19.5C32.8892 19.5 39.3003 25.3756 39.4354 32.6717C39.4443 33.1556 39.1441 33.5985 38.6704 33.8003C34.5073 35.5742 29.8764 36.5625 25.0006 36.5625C20.1243 36.5625 15.493 35.574 11.3296 33.7998C10.8559 33.598 10.5557 33.155 10.5647 32.6712Z" fill={color}/>
  </Svg>
);

export default UserIcon;