import React, { useState, useEffect } from 'react';
import { SVG } from '../svg/default'; const svgInst = new SVG();
import { useNavigate } from 'react-router-dom';

const ProjectRoute: React.FC = ({project}) => {
  const navigate = useNavigate();

  const clickNavigate = (title) => {
  navigate(`/${title}`);
} 

  return (
    <>
  <div className="container-triangle" onClick={() => clickNavigate(project)}>
  <div className="text-box _t">{project}</div>
</div>
    </>
  )


  // return (
  //   <>



  //     <div className='project-click-btn' onClick={() => clickNavigate(project)}>
  //     <div className="back-btn-header" dangerouslySetInnerHTML={{ __html: svgInst.backArrowHeader() }}></div>
  //     <div className='back-btn-text'>{project}</div>
  //     </div>
  //     </>
  //     );
};

export default ProjectRoute;
