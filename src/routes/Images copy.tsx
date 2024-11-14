import React, { useEffect, useRef, useState } from 'react';
import ImageBox from '../components/ImageBox';
import ImageInfo from '../components/ImageInfo';
import ImageFooter from '../components/ImageFooter';
import ImageHeaderButton from '../components/ImageHeaderButton';
import OverlayProjects from '../components/OverlayProjects';
import classMap from '../tools/sharedMap';

const Images: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [headerTop, setHeaderTop] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [addedImages, setAddedImages] = useState([])
  const [showDialog, setShowDialog] = useState(false);
  const [dialogPage, setDialogPage] = useState(0);
  // const [project, setProject] = useState('');
  const [openInfo, setOpenInfo] = useState(false);
  const isListenerAdded = useRef(false); // Track if listener was added

  const handleImagesLoadedChange = () => {
    setOpenInfo(true)
    setImagesLoaded(true);
    };

  useEffect(() => {//Scroll Bottom on Image Loaded
    if (scrollRef.current && imagesLoaded) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight; // Start at the bottom
    }
    }, [imagesLoaded]);

    useEffect(() => { //add Scroll Listener
    if (scrollRef.current && !isListenerAdded.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);
      isListenerAdded.current = true; // Mark listener as added
      // Cleanup function to remove the listener on unmount
      return () => {
        // scrollRef.current.removeEventListener('scroll', handleScroll);
      };
    }
  }, []); // Empty dependency array to run only once

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop } = scrollRef.current;
      setHeaderTop(scrollTop === 0);
    }
  };

  const onButtonClick = (type) => { //header Button - show all projects
    console.log(type)
    setDialogPage(0)
    setShowDialog(true)
  }

  const newProject = () => {//footer Button - new Project
    console.log('newProject')
    setDialogPage(1)
    setShowDialog(true)
  }

  const [triggerSwitch, setTriggerSwitch] = useState(false);
    useEffect(() => {
        console.log(triggerSwitch)
  }, [triggerSwitch]);
 

  const fileInputRef = useRef(null);

  const handleButtonClick = () => fileInputRef.current.click();

  return (
    <>
    <main className='image-var'>
    <div className={headerTop ? 'image-header top' : 'image-header'}>
      <div className='image-header-text'></div>
      <div className='image-header-action'>
      {<ImageHeaderButton type={'projects'} onClick={onButtonClick}/>}
      {<ImageHeaderButton type={'select'}/>}
      {/* {headerTop ? <ImageHeaderButton type="down" /> : <ImageHeaderButton type="up" />} */}
      {/* {<ImageHeaderButton type={'search'}/>} */}
      </div>
    </div>
      <div className="app-container-images">
        <main 
        className="content-images"
        ref={scrollRef}>
        <ImageBox
        scrollRef={}
        fileInputRef={fileInputRef}
        onImagesLoadedChange={handleImagesLoadedChange} 
        onTriggerSwitch={triggerSwitch}
        addedImages={addedImages}
        />
        <ImageInfo openInfo={openInfo} newProjectClick={newProject} />
        </main>
      {<ImageFooter imageClick={handleButtonClick} newProjectClick={newProject} />}
      </div>
      </main>
      <OverlayProjects isOpen={showDialog} dialogPage={dialogPage} onClose={() => setShowDialog(false)}/>
      </>
  );
};

export default Images;
