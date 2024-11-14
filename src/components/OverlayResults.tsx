import React, { useState, useEffect } from 'react';
import { API } from '../data/API.js'; const api = new API();
import { getHazardRangeColor } from '../data/levels.js';
import { ImageRenderer } from '../data/images'; const ImageData = new ImageRenderer();
import { useNavigate } from 'react-router-dom';

interface OverlayDialogProps {
  isOpen: boolean;
  entryValue: Array<T>;
  sha: String;
  onClose: () => void;
}

const OverlayResults: React.FC<OverlayDialogProps> = ({ isOpen, entryValue, onClose }) => {

const [inputValue, setInputValue] = useState(entryValue);
const [projectValues, setProjectValues] = useState([]);
const [projectImages, setProjectImages] = useState([]);
const navigate = useNavigate();
 
// const [valuesEqual, setValuesEqual] = useState(true);
// const [hazardLvls, setHazardLvls] = useState({})

  // useEffect(() => {
  //   console.log("Input value updated:", entryValue); // Log the new value
  //   setInputValue(entryValue)
  // }, [entryValue]);

    useEffect(() => {//Load Projects
    (async () => {
      setInputValue(entryValue)
      const { project, element } = entryValue
      const ddd = await api.elementSearch({ project, element })
      console.log(ddd)
      const imageResults = await Promise.all(
        ddd
          .filter(f => f.sha !== undefined) // filter out items without a `sha`
          .map(async (a) => {
            const { sha } = a;
            //console.log(`Processing sha: ${sha}`);
            
            try {
              const imgData = await ImageData.imgBySha(sha);
              
              if (imgData?.status === 204) {
                console.log(`Image with sha: ${sha} not found.`);
                return null; // or handle not found case accordingly
              }
              
              //console.log(`Image data found for sha: ${sha}`, imgData);
              return imgData;
            } catch (error) {
              console.error(`Error retrieving image for sha: ${sha}`, error);
              return null; // or handle error case as needed
            }
          })
      );

const validImages = imageResults.filter(img => img !== null);
setProjectImages(validImages)
setProjectValues(ddd)
    })();
  }, [entryValue]);

  const closeDialog = () => { onClose() }

  const openImage = (clickImage) => {
      navigate(`/result/${clickImage}`);   
  }

  const projectLoop = () => {
    return (
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
              <div
                className='quick-result-ball'
                style={{ backgroundColor: getHazardRangeColor(item.risk_rating).bck_color }}>
                {item.risk_rating}
              </div>
              <div className='quick-result-text'>
                <div className='quick-result-text-title'>{item.type} | {item.area}</div>
                <div>{item.decision}</div>
            </div>
            </div>
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <>
      {isOpen && (
        <div className={`overlay-dialog ${isOpen ? 'show' : ''}`}>
            <div className='overlay-dialog-inner'>
            <div className='dialog-header'>
                <div>{inputValue.project}: {inputValue.element}</div>
                <div onClick={() => closeDialog()}>x</div>
            </div>
          <div className="dialog-content assessment">
        {projectLoop()}
          </div>
            <div className='dialog-footer'></div>
          </div>
        </div>
      )}
    </>
  );
};

export default OverlayResults;
