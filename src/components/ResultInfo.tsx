import React from 'react';
import { useNavigate } from 'react-router-dom';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();

const ResultInfo: React.FC = () => {
  
  const navigate = useNavigate();
  const closeElement = () => navigate('/'); 

  return (
    <>
        <div className="content-images-info">{textToken.getToken('noResults')}
        <div className="btn-row">
          <div className="btn project" onClick={() => closeElement()}>{textToken.getToken('back')}</div>
        </div></div>
        </>
      );
};

export default ResultInfo;