import React, { useState, useEffect } from 'react';
import classMap from '../sharedMap';
const textToken = classMap.get('textToken');

const ImageHeaderButton: React.FC = ({type, onClick}) => {

  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(textToken.getToken(type))
  }, [type]);

  return (
    <>
        <div className="ihb-wrapper" onClick={() => onClick(type)}>
          <div className="ihb"></div>
          <div className="ihb-txt">{content}</div>
        </div>
        </>
  );
};

export default ImageHeaderButton;
