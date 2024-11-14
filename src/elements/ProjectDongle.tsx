import React, { useState, useEffect } from 'react';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import { SVG } from '../svg/default'; const svgInst = new SVG();
import { useNavigate } from 'react-router-dom';

const ProjectDongle: React.FC = ({project, setSortProject, onButtonClick}) => {
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [select, setSelect] = useState(true);

  const clickNavigate = (title) => {
  navigate(`/project/${title}`);     
  }

  const clickSelect = (title) => {
  setSortProject(title)     
  } 

  return (
    <>
        <div className={`project-assessment-dongle ${select ? 'edit' : ''}`}>
        <div className="project-assessment-dongle-svg" dangerouslySetInnerHTML={{ __html: svgInst.segments('ra') }}></div>
        <div className='_t' onClick={() => clickSelect(project)}>{project}</div>
        {edit && (
          <>
          <div className='pad-edit-btn'>
          <div className='_t'>edit</div>
          </div>
          </>
          )}
          {select && (
          <>
          <div className="dongle-dropdown" onClick={() => onButtonClick('projects')} 
          dangerouslySetInnerHTML={{ __html: svgInst.dropdown_dongle() }}></div>
          </>
          )}
        </div>
    </>
  )
};

export default ProjectDongle;
