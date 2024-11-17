import React, { useRef, useEffect, useState, forwardRef  } from 'react';
import { SVG } from '../svg/default'; const svgInst = new SVG();
import ProjectRoute from '../components/ProjectRoute';
import { useNavigate } from 'react-router-dom';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();

const ImageLoop = forwardRef(({ images, incompleteItems, itemsToSync, projectFlow = false, edit = false }, ref) => {
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {//apply settings
      const retrievedSettings = localStorage.getItem('settings');
      let settingsObj = {};
      try {
          settingsObj = JSON.parse(retrievedSettings) || {};
      } catch (error) {
          console.error("Failed to parse settings from localStorage:", error);
      }
      if (ref?.current) {
          const imageRepeat = settingsObj.imagerepeat ?? 4; // Fallback to 4 if imagerepeat is undefined or null
          ref.current.style.setProperty('--image-repeats', imageRepeat);
      }
  }, [location]);

  const imgClick = (imageID) => {
    navigate(`/result/${imageID}`); 
  }  

  useEffect(() => {//Click Stuff

    if(!ref?.current) return
      ref.current.onclick = (e) => {
      const { dataset } = e?.target
        switch (true) {
            case dataset.imageIndex !== undefined: //Valid Image Clicked
            console.log(edit)
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



let lastProject = ''

  const innerLoop = () => {
    return (
      <>
        <div ref={ref} className="image-content-grid">
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
              <div className={`igc ${placeholder ? 'img-ph' : ''}`}
                onClick={() => imgClick(id)}
                data-index={id}
                data-image-index={id}
                data-title={project || undefined}>
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
                {itemsToSync.includes(id) && (
                  <div className="lds-ripple">
                    <div></div>
                    <div></div>
                  </div>
                )}
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
  };

return (
  <>
  { images.length === 0 ? ( <div className='no-results'>Nothing here yet, upload Image</div> ) : ( innerLoop() ) }
  </>
  );
});

export default ImageLoop;
