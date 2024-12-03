import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonRipple from '../elements/ButtonRipple';
import { API } from '../data/API.js'; const api = new API();

import classMap from '../sharedMap';
const textToken = classMap.get('textToken');

const FloatingActionButtons = ({ isOpen, setIsOpen, setShowDialog, project, type = 'default', position = 'bottom' }) => {
  
  const navigate = useNavigate();

  const [loaderIndex, setLoaderIndex] = useState('')

  const menus = {
    default: [
    {txt: 'searchImages', click: 'searchImages'},
    {txt: '-' },
    {txt: 'projectOverview', click: 'allProjects'},
    {txt: 'createNewProject', click: 'newProject'},
    {txt: '-' },
    // {txt: 'select Images', click: 'editImages'},
    {txt: 'view Checklist', click: 'projectChecklist'},
    {txt: 'view Analyse, result, assessment', click: 'analyze'},
    {txt: '-' },
    {txt: 'downloadReport', click: 'report'},
    {txt: 'downloadChecklist', click: 'checklist'},
    // {txt: 'edit Project', click: 'editProject'}
  ],
    assessment: [
    {txt: 'projectOverview', click: 'allProjects'},
    // {txt: 'open All Assessments', click: 'openAll'},
    {txt: 'Download Report', click: 'report'},
    {txt: 'downloadChecklist', click: 'checklist'},
  ]
  }


  const [visibleButtons] = useState(menus[type]);

  const handleClick = (type) => {
    console.log(type)

    setTimeout( async () => {
      let closeAfter = true
    switch (type) {
      case 'report':
      case 'checklist':
        closeAfter = false
        setLoaderIndex(type)
        await api.getReport({ project, report: type })
        setLoaderIndex('')
        break;
      case 'newProject':
        setShowDialog(true)
        break;
        case 'analyze':
        navigate(`/assessment/${project}`);  
        break;
        case 'searchImages':
        navigate(`/search`);  
        break;       
        case 'projectChecklist':
        navigate(`/checklist/${project}`);  
        break;       
        case 'allProjects':
        navigate(`/projectoverview/`);  
        break;
        case 'editProject':
        setShowDialog(true)
        break;
      default:
        break;
    }
    if (closeAfter) setIsOpen(false)
    }, 200);
  };

return (
  <div className={`fab-container ${position}`}>
    {isOpen && (
      <div className="fab-buttons">
        {visibleButtons.map(({ txt, click }, index) => (
          txt === '-' ? (
            <div key={index} className='floating-btn-divider'/>
          ) : (
            <div key={index}>
              <div className="floating-btn" onClick={() => handleClick(click)}>
                <ButtonRipple
                  index={index}
                  text={textToken.getToken(txt)}
                  loader={loaderIndex === click}
                />
              </div>
            </div>
          )
        ))}
      </div>
    )}
  </div>
);
};

export default FloatingActionButtons;
