import React, { useRef, useEffect, useState  } from 'react';
import ProjectRoute from './ProjectRoute';
import { useNavigate } from 'react-router-dom';
import classMap from '../sharedMap';
const textToken = classMap.get('textToken');
const svgInst = classMap.get('svgInst');

const ImageLoop = (({ images, projectFlow = false, searchTerm}) => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemsToSync, setItemsToSync] = useState([]);
  const [incompleteItems, setIncompleteItems] = useState([]);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  
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

  const ImageFlow = () => {
    return (
      <>
        <div key={'init'} ref={contentContainerRef} className="image-content-grid">
        {images.map(({ blobUrl, id, project, score, clr, placeholder = false }) => {
          const isNewProject = project !== lastProject;
          lastProject = project;
          return (
            <React.Fragment key={id}>
              {isNewProject && projectFlow && (
                <div className="project-row" data-project={project}>
                  <ProjectRoute project={project} />
                </div>
              )}
              <div className={`igc`} onClick={() => imgClick(id)} key={id}>
                {!placeholder && (
                  <img
                    loading="lazy"
                    className={incompleteItems.includes(id) ? 'imgD missing' : 'imgD'}
                    src={blobUrl}
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
  }

  const highlightSearchTerm = (text) => {//highlight entire word
    if (!searchTerm) return text;

    // Escape special regex characters in the search term
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
    // Regex to match the entire word containing the search term
    const regex = new RegExp(`\\b\\w*${escapedTerm}\\w*\\b`, 'gi');
  
    // Replace the entire matched word with highlighted span
    const highlightedString = text.replace(
      regex,
      '<span class="highlight">$&</span>'
    );
  
    return highlightedString;
  }


  const highlightSearchTermX = (text) => {//highlight only searchterm
    if (!searchTerm) return text;
  
    // Escape special regex characters in the search term
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
    // Create a regex to match any word containing the search term
    const regex = new RegExp(`(${escapedTerm})`, 'gi');
  
    // Replace matched terms with highlighted span
    const highlightedString = text.replace(
      regex,
      '<span class="highlight">$&</span>'
    );
  
    return highlightedString;
  }
  




  const ImageResultFlow = () => {
    return (
      <>
        <div key={'init'} ref={contentContainerRef} className="image-content-result-flow">
        {images.map(({ blobUrl, id, project, title, clr, description }) => {
          const isNewProject = project !== lastProject;
          lastProject = project;
          return (
            <React.Fragment key={id}>
              {isNewProject && projectFlow && (
                <div className="project-row" data-project={project}>
                  <ProjectRoute project={project} />
                </div>
              )}
              <div className='image-result-flow-box' onClick={() => imgClick(id)}>
              <div className={`igcR`} key={id}>
                  <img
                    loading="lazy"
                    className={incompleteItems.includes(id) ? 'imgD missing' : 'imgD'}
                    src={blobUrl}
                    alt="image"
                  />

                {selectedItems.includes(id) && (
                  <div className="image-selected" dangerouslySetInnerHTML={{ __html: svgInst.image_selected() }} />
                )}
                {itemsToSync.includes(id) && ( imageRipple() )}
              {clr && clr !== '' && (
                <div className="img-result-dongle" style={{ backgroundColor: clr }}></div>
              )}
              </div>
                <div className='image-result-flow-box-content'>
                  {title && (<div 
                  className='image-result-flow-box-title'
                  dangerouslySetInnerHTML={{ __html: highlightSearchTerm(title) }}
                  />)}
                  {description &&(<div 
                  className='image-result-flow-box-txt'
                  dangerouslySetInnerHTML={{ __html: highlightSearchTerm(description[description.length - 1]) }}/>)}
                </div>
              </div>



            </React.Fragment>
          );
        })}
          {imageInfo()}
        </div>
      </>
    );
  }


let lastProject = ''

    return (
      <>

  {ImageResultFlow()}
      </>
    );
});

export default ImageLoop;
