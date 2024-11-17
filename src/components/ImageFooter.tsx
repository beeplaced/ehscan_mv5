import React, { useState, useRef } from 'react';
import { SVG } from '../svg/default'; const svgInst = new SVG();
import { useNavigate } from 'react-router-dom';
import FloatingActionButtons from '../elements/FloatingActionButtons';
import OverlayProjects from './OverlayProjects';

const ImageFooter: React.FC = ({ edit, project, handleFileInput, pop }) => {
  const fileInputRef = useRef(null);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

    const footerClick = (type) => {//footer Button - new Project
    console.log(type)

    switch (type) {
      case 'menu':
        navigate(`/menu/`);  
        break;
      case 'plus':
        setIsFabOpen(isFabOpen ? false : true)
        break;
      case 'imgButton':
        fileInputRef?.current?.click();
        break;
      default://menu
        break;
    }
  }

  return (
    <>
      <OverlayProjects isOpen={showDialog} onClose={() => setShowDialog(false)}/>
      <FloatingActionButtons isOpen={isFabOpen} setShowDialog={setShowDialog} setIsOpen={setIsFabOpen} project={project} />
      {edit ? (<div className='image-footer edit'>
        <div className='f-edit-left'>Objekte Auswählen</div>
        <div className='f-side'>
          <div onClick={() => footerClick('moveSelected')} dangerouslySetInnerHTML={{ __html: svgInst.footer_move() }}/>
          <div onClick={() => footerClick('analyzeSelected')} dangerouslySetInnerHTML={{ __html: svgInst.footer_analyze() }}/>          
          <div onClick={() => footerClick('deleteSelected')} dangerouslySetInnerHTML={{ __html: svgInst.footer_delete() }}/>
        </div>
      </div>) : (
        <div className="image-footer">
          <div className='f-side'>
          <div onClick={() => footerClick('menu')} dangerouslySetInnerHTML={{ __html: svgInst.footer_settings() }}/>
          </div>
            <div className='f-inside'>
              <div className='footer-middle-back' dangerouslySetInnerHTML={{ __html: svgInst.bckGr() }}/>
              <div className='footer-middle-ball' onClick={() => footerClick('imgButton')} dangerouslySetInnerHTML={{ __html: svgInst.bckGrBall(pop) }}/>
            </div>
          <div className='f-side'>
          <div onClick={() => footerClick('plus')} dangerouslySetInnerHTML={{ __html: svgInst.footer_menu(isFabOpen) }}/>
          </div>
        </div>
        )}
        <input type="file" ref={fileInputRef} onChange={handleFileInput} multiple/>   
        </>
  );
};

export default ImageFooter;
