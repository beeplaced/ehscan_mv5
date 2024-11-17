import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonRipple from '../elements/ButtonRipple';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();

const FloatingActionButtons = ({ isOpen, setIsOpen, setShowDialog, project, type = 'default', position = 'bottom' }) => {
  
  const navigate = useNavigate();

  const menus = {
    default: [
    {txt: 'createNewProject', click: 'newProject'},
    {txt: 'projectOverview', click: 'allProjects'},
    {txt: 'select Images', click: 'editImages'},
    {txt: 'view Analyse, result, assessment', click: 'analyze'},
    {txt: 'Download Report', click: 'report'},
    // {txt: 'edit Project', click: 'editProject'}
  ],
    assessment: [
    {txt: 'projectOverview', click: 'allProjects'},
    {txt: 'open All Assessments', click: 'openAll'},
    {txt: 'Download Report', click: 'report'},
    // {txt: 'edit Project', click: 'editProject'}
  ]
  }


  const [visibleButtons, setVisibleButtons] = useState(menus[type]);

  const handleClick = (type) => {
    console.log(type)

    setTimeout(() => {
    switch (type) {
      case 'newProject':
        setShowDialog(true)
        break;
        case 'analyze':
        navigate(`/assessment/${project}`);  
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
    setIsOpen(false)
    }, 200);
  };

return (
  <div className={`fab-container ${position}`}>
    {isOpen && (
      <div className="fab-buttons">
        {visibleButtons.map(({ txt, click }, index) => (
          <div key={index} className="">
            <div className="floating-btn" onClick={() => handleClick(click)}>
              <ButtonRipple index={index} text={textToken.getToken(txt)} />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default FloatingActionButtons;
