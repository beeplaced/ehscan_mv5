import React, { useState, useEffect, useRef } from 'react';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import { API } from '../data/API.js'; const api = new API();
import { SVG } from '../svg/default'; const svgInst = new SVG();
import { useNavigate } from 'react-router-dom';
import DialogProject from '../dialogs/DialogProject';

interface OverlayDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dialogPage: Number;
}

const OverlayDialog: React.FC<OverlayDialogProps> = ({ isOpen, onClose, initProject = '' }) => {

const navigate = useNavigate();
const [newProject, setNewProject] = useState('');
const [title, setTitle] = useState(textToken.getToken('projects'));
const [footerContent, setFooterContent] = useState('');
const swiperRef = useRef(null);
const [isAtTop, setIsAtTop] = useState(true);
const [dialogClose, setDialogClose] = useState()

const scrollRef = useRef<HTMLDivElement>(null);
const init = {
    assessment: 'risk_assessment', //Default
    title: '',
    context: '',
    activities: '',
    comment: ''
  }


const [inputValue, setInputValue] = useState(init);

  const handleScroll = () => {
    console.log('s')
    if (scrollRef.current) {
      const { scrollTop } = scrollRef.current;
      setIsAtTop(scrollTop === 0);
    }
  };

  const closeDialog = () => {//Closed by self
    //if new Project - go to new Page and close
    onClose();
  }

    useEffect(() => {//Closed by inner Dialog
      if (newProject !== '') navigate(`/projectview/${newProject}`);  
      if (dialogClose) closeDialog();
  }, [dialogClose]);

  useEffect(() => {//Load Project
    (async () => {
      console.log(initProject)
    })();
  }, [initProject]);

  const header = () => {
    return (
        <header className={`dialog-header ${!isAtTop ? 'shrink' : ''}`}>
          <div className='dialog-header-svg-icon' dangerouslySetInnerHTML={{ __html: svgInst.pencil() }}></div>
          <div className='header-title _t'>{isAtTop && title}</div>
          <div className="header-close" onClick={() => closeDialog()}>{textToken.getToken('close')}</div>
        </header>
    )
  };

  const body = () => {

    return (
      <>
        <div className="content-scroll">
          {<DialogProject entryValue={inputValue} setNewProject={setNewProject} setDialogClose={setDialogClose}/>}
      </div>
      </>
    )
  };

  const footer = () => {
    return (
      <>
      <div className='dialog-footer'>{footerContent}</div>
      </>
    )
  };

  return (
    <>
    {isOpen && (
    <div className={`overlay-dialog ${isOpen ? 'show' : ''}`}>
    <div className="overlay-dialog-container create">
    <div className="overlay-scroll" ref={scrollRef}>
    {header()}
    {body()}
    </div>
    {footer()}
    </div>
    </div>
  )}
    </>
  );

};

export default OverlayDialog;