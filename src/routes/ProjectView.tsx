import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageRenderer } from '../data/images'; const ImageData = new ImageRenderer();
import { SVG } from '../svg/default'; const svgInst = new SVG();
import useScrollListener from '../tools/useScrollListener';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import OpacityHeader from '../elements/OpacityHeader';
import ImageFooter from '../components/ImageFooter';
import ImageLoop from '../components/ImageLoop';
import classMap from '../tools/sharedMap';

const ProjectResult: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Access the id parameter

  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const { scrollRef, isAtTop } = useScrollListener();
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [images, setImages] = useState([]);
  const [itemsToSync, setItemsToSync] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [incompleteItems, setIncompleteItems] = useState([]);

  useEffect(() => {//Load Initial
      (async () => {
        setLoading(true)
        const blobs = await ImageData.imagesByProjectID(id)
        //console.log(blobs)
        setImages(blobs);
        setLoading(false)
        setTitle(id)
      })();
    setLoaded(true)
     }, [id]);


const handleFileInput = async (e) => {
    const selectedFiles = e.target.files
    console.log(selectedFiles)
    if (!selectedFiles || selectedFiles.length === 0) return; // Early return if no files are selected
    const fileArray = Array.from(selectedFiles);
    const addBlobs = await classMap.get('ImageData').addImages(fileArray)
    addOrUpdateImages(addBlobs)
  };

const addOrUpdateImages = (blobs) => {
  setImages((prevImages) => {
    // Loop through each new image and check if its id already exists in prevImages
    const updatedImages = prevImages.filter((existingImage) => {
      // Keep the existing image only if its id is not in the new blobs
      return !blobs.some((newImage) => newImage.id === existingImage.id);
    });
    // Append the new images to the end of the updated array
    return [...updatedImages, ...blobs];
  });
};


//Image Handler for Upload
//Trigger - Footer
//output Images

  const closeElement = () => navigate('/');

  const contentContainerRef = useRef<HTMLDivElement>(null)

  return (
    <>
    <OpacityHeader isAtTop={isAtTop} title={title} closeElement={closeElement}/>
      <div className="app-container-result result-page">
      <main ref={scrollRef} className={`content image-result ${loaded ? 'fade-in' : ''}`}>
          <div className='image-project-view'>
          {<ImageLoop
          ref={contentContainerRef}
          images={images}
          incompleteItems={incompleteItems}
          itemsToSync={itemsToSync}/> }
          </div>
        {<ImageFooter edit={edit} project={title} handleFileInput={handleFileInput}/> }
      </main>
      </div>
    </>
  );
};

export default ProjectResult;