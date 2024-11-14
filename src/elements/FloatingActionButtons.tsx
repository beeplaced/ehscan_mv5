import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

const FloatingActionButtons = ({ isOpen, setIsOpen, setShowDialog, project }) => {
  
  const navigate = useNavigate();
  const [visibleButtons, setVisibleButtons] = useState([
    {txt: 'select Images', click: 'editImages'},
    {txt: 'view Analyse, result, assessment', click: 'analyze'},
    {txt: 'Download Report', click: 'report'},
    {txt: 'new Project', click: 'newProject'},
    // {txt: 'edit Project', click: 'editProject'}
  ]);

  const handleClick = (type) => {
    switch (type) {
      case 'newProject':
        setShowDialog(true)
        break;
        case 'analyze':
        navigate(`/assessment/${project}`);  
        break;
      case 'editProject':
        setShowDialog(true)
        break;
      default:
        break;
    }
    setIsOpen(false)
  };

  return (
    <div className="fab-container">
      {isOpen && (
        <div className="fab-buttons">
          {visibleButtons.map(({ txt, click }, index) => (
            <button
              key={index}
              className="fab-button"
              onClick={() => handleClick(click)}>
              {txt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingActionButtons;
