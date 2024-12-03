import React, { useRef, useEffect, useState  } from 'react';
import ProjectRoute from '../components/ProjectRoute';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../tools/WebSocketContext';
import classMap from '../sharedMap';
const textToken = classMap.get('textToken');
const svgInst = classMap.get('svgInst');
const ImageData = classMap.get('ImageData');

const ImageLoop = (({ images, projectFlow = false, edit = false }) => {
  const navigate = useNavigate();
  const {message, sendMessage} = useWebSocket();
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemsToSync, setItemsToSync] = useState([]);
  const [incompleteItems, setIncompleteItems] = useState([]);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {//CHANGES BY MESSAGE
    if (!message || message.length === 0) return

    console.log(message)

    switch (true) {
      case message.missing !== undefined:
          (async () => {
          const { missing } = message
            missing.map(async (sha) => {
            const imageID = await ImageData.imgIDBySHA(sha)
            setIncompleteItems((prevIncItems) => [...new Set([...prevIncItems, imageID])]);
            })
          })();
        break;
        case message.sync !== undefined && message.sha !== undefined:
          (async () => {
          const { sync, sha } = message
          const imageID = await ImageData.imgIDBySHA(sha)
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
      const retrievedSettings = localStorage.getItem('settings');
      let settingsObj = {};
      try {
          settingsObj = JSON.parse(retrievedSettings) || {};
      } catch (error) {
          console.error("Failed to parse settings from localStorage:", error);
      }
      if (contentContainerRef?.current) {
          const imageRepeat = settingsObj.imagerepeat ?? 4; // Fallback to 4 if imagerepeat is undefined or null
          contentContainerRef.current.style.setProperty('--image-repeats', imageRepeat);
      }
  }, [location]);

  const imgClick = (imageID) => {
    navigate(`/result/${imageID}`); 
  }  

  useEffect(() => {//Click Stuff
    if(!contentContainerRef?.current) return
    contentContainerRef.current.onclick = (e) => {
      const { dataset } = e?.target
        switch (true) {
            case dataset.imageIndex !== undefined: //Valid Image Clicked
                const imageID = parseInt(dataset.imageIndex)
                if (edit){
                  setSelectedItems((prevSyncItems) => [...new Set([...prevSyncItems, imageID])]);//add
                //remove!!!!!
                }else{
                navigate(`/result/${imageID}`);  
                }
                break;
            default:
                break;
        }
      }
  },[]);

//add Images

//remove Images

//Sort Images


  const imageInfo = () => {
    return (
      <>
      <div className="image-info">
        {images.length > 10 && `${images.length} ${textToken.getToken('fotos')}`}
        </div>
        </>
    )
  }

  const imageRipple = () => {
    return (
      <>
      <div className="lds-ripple"><div></div><div></div></div>
      </>
    )
  }


let lastProject = ''

    return (
      <>
        <div ref={contentContainerRef} className="image-content-grid">
        {images.map(({ imgBlob, id, project, score, clr, placeholder = false }) => {
          const isNewProject = project !== lastProject;
          lastProject = project;
          return (
            <React.Fragment key={id}>
              {isNewProject && projectFlow && (
                <div className="project-row" data-project={project}>
                  <ProjectRoute project={project} />
                </div>
              )}
              <div className={`igc`}
                onClick={() => imgClick(id)} data-index={id}>
                {!placeholder && (
                  <img
                    loading="lazy"
                    className={incompleteItems.includes(id) ? 'imgD missing' : 'imgD'}
                    src={imgBlob}
                    alt="image"
                  />
                )}
                {selectedItems.includes(id) && (
                  <div className="image-selected" dangerouslySetInnerHTML={{ __html: svgInst.image_selected() }} />
                )}
                {itemsToSync.includes(id) && ( imageRipple() )}
              {clr && clr !== '' && (
                <div className="img-result-dongle" style={{ backgroundColor: clr }}></div>
              )}
              </div>
            </React.Fragment>
          );
        })}
          {imageInfo()}
        </div>
      </>
    );
});

export default ImageLoop;
