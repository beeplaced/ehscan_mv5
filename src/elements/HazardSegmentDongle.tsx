import React, { useState, useRef } from 'react';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import { SVG } from '../svg/default'; const svgInst = new SVG();
import { API } from '../data/API.js'; const api = new API();
import { ImageRenderer } from '../data/images'; const ImageData = new ImageRenderer();
import { useNavigate } from 'react-router-dom';
import useRipple from '../tools/useRipple';  // Import the custom hook
import StatusBar from './StatusBar';  // Import the custom hook
import { getHazardRangeColor } from '../data/levels.js';

const HazardSegmentDongle: React.FC = ({ entry, project }) => {
const navigate = useNavigate();

const [projectValues, setProjectValues] = useState([]);
const [projectImages, setProjectImages] = useState([]);
const [content] = useState(entry);
const [fade, setFade ] = useState(false);
const buttonRef = useRef(null);
const handleRipple = useRipple(); // Use the custom hook
  

  const handleButtonClick = (event) => {
    handleRipple(event, buttonRef);
      setTimeout(() => {
        getDetails()
        setFade(!fade)
    }, 200);
  };

  const getDetails = async () => {
    const element = entry.hazard
    const elementResults = await api.elementSearch({ project, element })
    const imageResults = await Promise.all(
        elementResults
          .filter(f => f.sha !== undefined) // filter out items without a `sha`
          .map(async (a) => {
            const { sha } = a;
            try {
              const imgData = await ImageData.imgBySha(sha);
              if (imgData?.status === 204) {
                console.log(`Image with sha: ${sha} not found.`);
                return null; // or handle not found case accordingly
              }
              return imgData;
            } catch (error) {
              console.error(`Error retrieving image for sha: ${sha}`, error);
              return null; // or handle error case as needed
            }
          })
      );

  const validImages = imageResults.filter(img => img !== null);
  setProjectImages(validImages)
  setProjectValues(elementResults)
  }

  return (
    <><div ref={buttonRef} className='ripple-container assessment-dongle' onClick={handleButtonClick}>
      <div>{content.hazard}</div>
      <div dangerouslySetInnerHTML={{ __html: content.status }} />
      </div>
      {fade && (
        <>
        {projectValues.map((item, index) => (
          <React.Fragment key={index}>
          {item.sha && (
            (() => {
              const foundImage = projectImages.find(f => f.sha === item.sha);
              const imgBlob = foundImage ? foundImage.imgBlob : null;
              return imgBlob ? (
                <div className='img-container-small' onClick={ () => openImage(foundImage.id) } >
                <img className="imgD" src={imgBlob} alt="image" />
                </div>
              ) : null;
            })()
          )}
            <div className='quick-result-wrapper'>

              <div className='quick-result-text'>
              {/* <div className='result-loop-header-text-title'>
                {item.type} {item.area ? `| ${item.area}` : ''}
              </div> */}
              <div className='result-loop-header-text-title'>{item.hazard}</div>
              <div>{item.decision}</div>
            </div>
            <div className='quick-result-ball' style={{ backgroundColor: getHazardRangeColor(item.risk_rating).bck_color }}></div>
            </div>
          </React.Fragment>
        ))}
      </>
      )}
    </>
  )
};

export default HazardSegmentDongle;