import React from 'react';
import Svg, { Path, Defs, G, ClipPath, SvgProps, Rect } from 'react-native-svg';

const PencilIcon = ({ width = 24, height = 24, color = "white" }) => (
    <Svg width={width} height={height} viewBox="0 0 15 15" fill="none">
        <G clipPath="url(#clip0_307_464)">
            <Path d="M10.625 1.87494C10.7892 1.71079 10.984 1.58058 11.1985 1.49174C11.413 1.4029 11.6429 1.35718 11.875 1.35718C12.1071 1.35718 12.337 1.4029 12.5515 1.49174C12.766 1.58058 12.9608 1.71079 13.125 1.87494C13.2892 2.0391 13.4194 2.23397 13.5082 2.44845C13.597 2.66292 13.6428 2.8928 13.6428 3.12494C13.6428 3.35709 13.597 3.58696 13.5082 3.80144C13.4194 4.01591 13.2892 4.21079 13.125 4.37494L4.6875 12.8124L1.25 13.7499L2.1875 10.3124L10.625 1.87494Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </G>
        <Defs>
            <ClipPath id="clip0_307_464">
                <Rect width="15" height="15" fill="none" />
            </ClipPath>
        </Defs>
    </Svg>

);

export default PencilIcon;

