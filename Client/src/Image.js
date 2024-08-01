import React from 'react';

export default function Image({src, ...rest}) {
  const link = src && src.includes('https://') ? src : 'http://localhost:4000/' + src; 
  return (
    <img {...rest} src={link}></img>
  )
}
