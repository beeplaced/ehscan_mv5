import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import { ImageRenderer } from '../data/images'; const ImageData = new ImageRenderer();
import { SVG } from '../svg/default'; const svgInst = new SVG();
import classMap from '../sharedMap';
import { useWebSocket } from '../tools/WebSocketContext';
import ProjectRoute from '../components/ProjectRoute';
import ImageInfo from '../components/ImageInfo';
import ImageLoop from '../components/ImageLoop';

const ImageBox: React.FC = ({ edit, fileInputRef, setHeaderTop, imgBoxAction, sortProject, onButtonClick }) => {

  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isListenerAdded = useRef(false); // Track if listener was added
  const location = useLocation();
  const {message, sendMessage} = useWebSocket();
  const [images, setImages] = useState([]);
  const [fadeItems, setFadeItems] = useState(false);
  const [projectRefs] = useState({});
  const [itemsToSync, setItemsToSync] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [incompleteItems, setIncompleteItems] = useState([]);
  const [projectFlow] = useState(true);
  const [openInfo, setOpenInfo] = useState(false);

  const handleFileInput = async (e) => {
      const selectedFiles = e.target.files
      if (!selectedFiles || selectedFiles.length === 0) return; // Early return if no files are selected
        const fileArray = Array.from(selectedFiles);
        await classMap.get('ImageData').sendImages(fileArray)
        const { blobs } = classMap.get('ImageData')
        setImages(blobs);
  };

   const [isFirstRender, setIsFirstRender] = useState(true);
    useEffect(() => { // Set initial scroll position before component becomes visible
    if (isFirstRender) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.style.visibility = 'hidden';
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          scrollRef.current.style.visibility = 'visible';
        }
        setIsFirstRender(false);
      });
    } else if (scrollRef.current) {
      scrollRef.current.style.visibility = 'hidden';
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      scrollRef.current.style.visibility = 'visible';
    }
  }, [isFirstRender]);

  useEffect(() => {
    switch (imgBoxAction) {
      case "deleteSelected":
      (async () => {
        //console.log(selectedItems)
        await classMap.get('ImageData').removeImages(selectedItems)
          setImages((prevImages) => {
            const idsToRemove = new Set(selectedItems); // Store ids to remove in a Set for fast lookup
            return prevImages.filter((image) => !idsToRemove.has(image.id)); // Remove images with ids in selectedItems
          });
        setSelectedItems([])
        })();
        break;
      case "analyzeSelected":
      (async () => {
        // await classMap.get('ImageData').removeImages(selectedItems)
        //   setImages((prevImages) => {
        //     const idsToRemove = new Set(selectedItems); // Store ids to remove in a Set for fast lookup
        //     return prevImages.filter((image) => !idsToRemove.has(image.id)); // Remove images with ids in selectedItems
        //   });
        // setSelectedItems([])
        })();
        break;


      default://remove

        break;
    }

  }, [imgBoxAction]);

  useEffect(() => {//CHANGES BY MESSAGE
    if (!message || message.length === 0) return

    switch (true) {
      case message.missing !== undefined:
          (async () => {
          const { missing } = message
            missing.map(async (sha) => {
            const imageID = await classMap.get('ImageData').imgIDBySHA(sha)
            setIncompleteItems((prevIncItems) => [...new Set([...prevIncItems, imageID])]);
            })
          })();
        break;
        case message.sync !== undefined && message.sha !== undefined:
          (async () => {
            const { sync, sha } = message
            const imageID = await classMap.get('ImageData').imgIDBySHA(sha)

           switch (true) {
                case sha && sync === true:
                      setItemsToSync((prevSyncItems) => [...new Set([...prevSyncItems, imageID])]);//add
                    break;
                  case sha && sync === false:
                      setItemsToSync((prevSyncItems) => prevSyncItems.filter((syncId) => syncId !== imageID));//remove
                    break;
                }
          })();
        break;
      default:
        break;
    }

  }, [message]);

  useEffect(() => {//apply settings
      // const retrievedSettings = localStorage.getItem('settings');
      // let settingsObj = {};
      // try {
      //     settingsObj = JSON.parse(retrievedSettings) || {};
      // } catch (error) {
      //     console.error("Failed to parse settings from localStorage:", error);
      // }
      // if (contentContainerRef?.current) {
      //     const imageRepeat = settingsObj.imagerepeat ?? 4; // Fallback to 4 if imagerepeat is undefined or null
      //     contentContainerRef.current.style.setProperty('--image-repeats', imageRepeat);
      // }

      const { blobs } = classMap.get('ImageData')
      setImages(blobs);
      sendMessage({ type: 'missing-results' });
  }, [location]);

  useEffect(() => {//Load Images
    (async () => {
      if(sortProject === '') return
        await classMap.get('ImageData').sortByProject(sortProject)
        const { blobs } = classMap.get('ImageData')
        setImages(blobs);
        setIsFirstRender(true)
      })();
  }, [sortProject]);

  // useEffect(() => {//Load Images
  //     const { blobs } = classMap.get('ImageData')
  //     setImages(blobs);
  //     //use Project
  //     //sendMessage({ type: 'missing-results' });
  // }, []);

  // useEffect(() => {//Switch Images
  //     (async () => {
  //       console.log('Switch Images', onTriggerSwitch)
  //       if (!onTriggerSwitch) return

  //       const targetProject = "Garage 2"
  //       const lastIndex = images.map(item => item.project).lastIndexOf(targetProject);
  //       console.log(lastIndex)
  //       const itemsToMove = images.filter(image => itemsToRemove.includes(image.id));
  //       console.log(itemsToMove)
  //       const filteredItems = images.filter(item => !itemsToMove.some(moveItem => moveItem.id === item.id));
  //       const updateItems = itemsToMove.map(item => ({ ...item, project: targetProject }));
  //       // const newItems = [
  //       //   ...filteredItems.slice(0, lastIndex + 1),
  //       //   ...updateItems,
  //       //   ...filteredItems.slice(lastIndex + 1)
  //       // ];

  //       const newBlobs = await classMap.get('ImageData').moveItems(updateItems, filteredItems, lastIndex)

  //       setImages(newBlobs);
  //     })();
  // }, [onTriggerSwitch]);

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
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
      setHeaderTop(scrollTop === 0);
      setOpenInfo(isBottom)
    }
  };

  //move Images 

      //   setImages((prevImages) => {
      //     const filteredImages = prevImages.filter((image) => image.id !== 0); //Remove Placeholder
      //     const updatedImages = [...filteredImages];
      //     const existingIndex = updatedImages.findIndex((image) => image.id === newImage.id);
      //     console.log(existingIndex)
      //     if (existingIndex !== -1) { // Replace the existing image with the new one
      //       updatedImages[existingIndex] = newImage;
      //       const replacedImage = updatedImages.splice(existingIndex, 1)[0]; // Remove the replaced image
      //       updatedImages.push(replacedImage); // Add it to the end of the array
      //     } else { // Add the new image if it doesn't exist
      //       updatedImages.push(newImage);
      //     }
      //     resolve(updatedImages); // Resolve with updated images after state update
      //     return updatedImages;
      // });

  const imageLoop = () => {
  let lastProject = null;
    return (
    <>
      {images.map(({ imgBlob, id, project }) => {
        const isNewProject = project !== lastProject;
        lastProject = project;
        return (
          <React.Fragment key={id}>
            {isNewProject && projectFlow && (
              <div 
                className="project-row" data-project={project}>
                    {<ProjectRoute project={project}/>}
                  
                </div>
            )}
            {imgBlob === "newProject" ? (
                <div 
                  data-index={id}
                  className={`igc`}
                  data-title={project || undefined}
                  ref={el => project ? projectRefs[project] = el : undefined}>
                  <div dangerouslySetInnerHTML={{ __html: svgInst.newProjectPlus() }} />
                </div>
              ) : (
              <div className='igc'
                data-index={id}
                data-image-index={id}
                // className={`${fadeItems && itemsToRemove.includes(id) ? ' fade-out' : ''}`}
                data-title={project || undefined}
                ref={el => project ? projectRefs[project] = el : undefined}>
                <img loading='lazy' className={incompleteItems.includes(id) ? 'imgD missing' : 'imgD' } src={imgBlob} alt="image" />
                {/* {syncItems.includes(id) && (
                <div className="image-sync-wrapper">
                    <div className="image-sync"></div>
                  </div>
                )}

                {errorItems.includes(id) && (
                  <div className="image-selected" dangerouslySetInnerHTML={{ __html: svgInst.attention() }} />
                )}
                {itemsToRemove.includes(id) && (
                  <div className="image-selected" dangerouslySetInnerHTML={{ __html: svgInst.image_selected() }} />
                )} */}

              {/* {incompleteItems.includes(id) && (
                <div className="image-sync-sign-wrapper">
                    <div className="image-sync-sign"></div>
                  </div>
                )} */}
              {selectedItems.includes(id) && (
              <div className="image-selected" dangerouslySetInnerHTML={{ __html: svgInst.image_selected() }} />
              )}
              {itemsToSync.includes(id) && (
              <div className="lds-ripple"><div></div><div></div></div>
              )}
              {/* {itemsToRemove.includes(id) && (
              <div className="image-selected" dangerouslySetInnerHTML={{ __html: svgInst.image_selected() }} />
              )} */}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
  };

  const contentContainerRef = useRef(null);

  return (
    <>
        <main className="content-images" ref={scrollRef}>
          {<ImageLoop
          ref={contentContainerRef}
          images={images}
          incompleteItems={incompleteItems}
          itemsToSync={itemsToSync}/> }
        <ImageInfo openInfo={openInfo} onButtonClick={onButtonClick} edit={edit} />
        </main>
        <input type="file" ref={fileInputRef} onChange={handleFileInput} multiple/>    
    
    </>
  )

};

export default ImageBox;

