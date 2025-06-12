import * as React from 'react';
import { Image } from 'react-native';

export default function Logo(props) {
  return (
    <Image
      source={{ uri: 'https://i.ibb.co/XR14QnX/logo.png' }}
      style={{
        width: props.width || 120,
        height: props.height || 120,
        ...props.style
      }}
      resizeMode="contain"
    />
  );
}