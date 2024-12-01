import React, { useState, useEffect } from 'react';
import FloatingLabelInput from '../tools/FloatingLabelInput';
import { API } from '../data/API.js'; const api = new API();
import classMap from '../sharedMap';
import TokenLibrary from '../text/TokenLibrary';
import { SVG } from '../svg/default';
import { ImageRenderer } from '../data/images';
classMap.set('textToken', new TokenLibrary()); const textToken = classMap.get('textToken');
classMap.set('svgInst', new SVG());
classMap.set('ImageData', new ImageRenderer());

import ButtonRipple from '../elements/ButtonRipple';

import { useNavigate, useLocation } from 'react-router-dom';

const Start: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

    useEffect(() => {

      (async () => {
        console.log(localStorage.getItem('project'))
        const project = localStorage.getItem('project')
            if (project) {
             navigate(`/${project}`);
              return;
            }
        const { title } = await api.getProject('last');        //if no project, grab from db
        if (title) {
          navigate(`/${title}`);
          return;   
        }
        //else do not navigate
      })();
    }, [location]);
   
    const [inputValue, setInputValue] = useState({
        title: '',
        context: ''
    });
  
    const setValue = (entry: Partial<typeof inputValue>) => {
      const newValue = {
        ...inputValue,
        ...entry
      };
      //console.log(newValue);
      setInputValue(newValue);
    };
  
    const handleButtonClick = async () => {
    
    const { title } = inputValue

    if (!title || title === '') {
      alert('add Title')
      return
    }
    const res = await api.setProject(inputValue)
    console.log(res)

    if (![200, 201].includes(res.status)) {
      //Wrong
      return
    }
    
    navigate(`/${title}`);  
  };

  return (
    <div className="start-page">
      <h1 className="start-page-text">
        EHSCAN
      </h1>

    <div className='slogan'>{textToken.getToken('slogan')}</div>


<div className='text-blocks'>
<FloatingLabelInput label="Start a new Project" value={inputValue.title} onChange={(value) => setValue({ title: value })} />
<FloatingLabelInput label="Add some Assessment Focus" value={inputValue.context} onChange={(value) => setValue({ context: value })} />
</div>
      <div className="start-page-button" onClick={handleButtonClick}>
        <ButtonRipple index="0" text="Let's Go"/>
      </div>
    </div>
  );

};

export default Start;

