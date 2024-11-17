import React, { useState, useEffect } from 'react';
import FloatingLabelInput from '../tools/FloatingLabelInput';
import { API } from '../data/API.js'; const api = new API();
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import { SVG } from '../svg/default'; const svgInst = new SVG();
import ButtonRipple from '../elements/ButtonRipple';

import { useNavigate, useLocation } from 'react-router-dom';

const StartPage: React.FC = () => {
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

      console.log('asd')

      return
    
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
<div className='text-blocks'>
<FloatingLabelInput label="Start a new Project" value={inputValue.title} onChange={(value) => setValue({ title: value })} />
<FloatingLabelInput label="Define the Assessment Context / Focus" value={inputValue.context} onChange={(value) => setValue({ context: value })} />
       
<div className='text-block-li'>Upload your images for automated Analysis</div>
<div className='text-block-li'>Download a report</div>
        </div>
      <div className="start-page-button" onClick={handleButtonClick}>
        <ButtonRipple index="0" text="Let's Go"/>
      </div>
    </div>
  );

};

export default StartPage;

