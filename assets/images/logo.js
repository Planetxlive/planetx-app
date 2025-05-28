import * as React from 'react';
import Svg, { Path, Ellipse } from 'react-native-svg';

export default function Logo(props) {
  return (
    <Svg
      width={props.width || 120}
      height={props.height || 120}
      viewBox="0 0 240 240"
      fill="none"
      {...props}
    >
      <Path
        d="M120 40L60 80V160L120 200L180 160V80L120 40Z"
        fill="#7C3AED"
      />
      <Path
        d="M120 80L90 100V140L120 160L150 140V100L120 80Z"
        fill="white"
      />
      <Path
        d="M90 100L120 120L150 100M120 120V160"
        stroke="#7C3AED"
        strokeWidth="10"
      />
      <Ellipse
        cx="120"
        cy="120"
        rx="85"
        ry="25"
        fill="none"
        stroke="#9ACD32"
        strokeWidth="10"
        transform="rotate(15 120 120)"
      />
    </Svg>
  );
}