import React, { useState, useEffect } from 'react';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import { SVG } from '../svg/default'; const svgInst = new SVG();
import ProjectDongle from '../elements/ProjectDongle';
import classMap from '../tools/sharedMap';
// interface OverlayDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   dialogPage: Number;
// }

const ImageInfo: React.FC = ({openInfo, onButtonClick, edit}) => {

  const [overlay, setOverlay] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)
  const [project, setProject] = useState('');
  const [amount, setAmount] = useState(0);
    // const xxx = () => {
    //   console.log("xxx")
    //   clickSwitchImages(true)

    //   //select Images
    //   //switch Images
    //   //ask if images shall be put to task queue
    // }

    useEffect(() => {//Scroll Bottom on Image Loaded
      setProject(classMap.get('ImageData').project)     
      setFadeIn(openInfo)
      setAmount(classMap.get('ImageData').blobs.length)
    }, [openInfo]);

    useEffect(() => {//Scroll Bottom on Image Loaded
      console.log(edit ? false : true)
      setFadeIn(edit ? false : true)
    }, [edit]);

  return (
    <>
      {overlay  ? (
        <>
        <div className="content-images-info images-bottom-spacer">{textToken.getToken('newProject')}
        <div className="btn-row"><div className="btn project" onClick={() => newProjectClick()}>{textToken.getToken('btn_newProject')}</div></div></div>
        </>
      ) : (
        <>
        <div className='image-spacer'></div>
          <div className={`content-images-info-bottom ${fadeIn ? 'visible' : ''}`}>
            <div className='info-inner'>
              <div className='info-inner-text'>{amount} Photos gesamt</div>
              <ProjectDongle project={project} onButtonClick={onButtonClick}/>
              </div>
          </div>
        </>

      )}
        </>
      );
};

export default ImageInfo;
