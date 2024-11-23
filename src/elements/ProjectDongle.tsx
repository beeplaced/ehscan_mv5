import React, { useState, useRef } from 'react';

import classMap from '../sharedMap';
const svgInst = classMap.get('svgInst');

import { useNavigate } from 'react-router-dom';
import useRipple from '../tools/useRipple';  // Import the custom hook
import StatusBar from './StatusBar';  // Import the custom hook

const ProjectDongle: React.FC = ({ entry }) => {
  const navigate = useNavigate();

  const [content, setContent] = useState(entry);
  const buttonRef = useRef(null);
  const handleRipple = useRipple(); // Use the custom hook

  const handleButtonClick = (event) => {
    handleRipple(event, buttonRef);
          setTimeout(() => {
      navigate(`/${content.title}`);   
    }, 200);
  };

  // const clickSelect = (title) => {
  //   //   setTimeout(() => {
  //   //   navigate(`/${title}`);   
  //   // }, 200);
     
  // } 


  return (
    <>
        <div ref={buttonRef} className='ripple-container project-dongle' onClick={handleButtonClick}>
          <div className='project-dongle-title _t'>{content.title}</div>
          {/* {content.assessment && (<div className='project-dongle-row'>
          <div className='project-dongle-icon' dangerouslySetInnerHTML={{ __html: svgInst.segments('ra') }}></div>
          <div className='project-dongle-container _t'>{content.assessment}</div>
          </div>)} */}

          {content.context && (<div className='project-dongle-row'>
          <div className='project-dongle-icon' dangerouslySetInnerHTML={{ __html: svgInst.segments('context') }}></div>
          <div className='project-dongle-container _tb'>{content.context}</div>
          </div>)}

          {/* {content.activities && (<div className='project-dongle-row'>
          <div className='project-dongle-icon' dangerouslySetInnerHTML={{ __html: svgInst.segments('ra') }}></div>
          <div className='project-dongle-container _t'>{content.activities}</div>
          </div>)} */}

          {content.comment && (<div className='project-dongle-row'>
          <div className='project-dongle-icon' dangerouslySetInnerHTML={{ __html: svgInst.segments('ra') }}></div>
          <div className='project-dongle-container _tb'>{content.comment}</div>
          </div>)}

          {content.locations && (<div className='project-dongle-row'>
          <div className='project-dongle-icon' dangerouslySetInnerHTML={{ __html: svgInst.segments('location') }}></div>
          <div className='project-dongle-container _t'>{content.locations}</div>
          </div>)}
          {content.score && (<div className='project-dongle-status-row'> {<StatusBar score={content.score}/>} </div>)}

          {content.amount > 0 && (<div className='project-dongle-row'>
          <div className='project-dongle-icon' dangerouslySetInnerHTML={{ __html: svgInst.segments('images') }}></div>
          <div className='project-dongle-container-images'>{content.amount} Images</div>
          </div>)}
          </div>
          </>
  )
};

export default ProjectDongle;