import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import classMap from '../sharedMap';
const ImageData = classMap.get('ImageData');

import useScrollListener from '../tools/useScrollListener';
import MainHeader from '../elements/MainHeader';
import ImageFooter from '../components/ImageFooter';
import ImageLoop from '../components/ImageLoop';
import Loader from '../tools/Loader';

//const ProjectView: React.FC = () => {
  const ProjectView = () => {
  const { id } = useParams<{ id: string }>(); // Access the id parameter
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('');
  const [scrollDownTrigger, setScrollDownTrigger] = useState(false);
  const { scrollRef, isAtTop } = useScrollListener({ scrollDown: true, scrollDownTrigger });
  const [loading, setLoading] = useState(false);
  const [pop, setPop] = useState(false);
  const [edit, setEdit] = useState(false);
  const [images, setImages] = useState([]);
  
  useEffect(() => {// Load Initial
      (async () => {
        setLoading(true)
        await ImageData.loadProjectImages(id)
        const { blobs } = ImageData
        const projectBlobs = blobs[id]
        setPop(projectBlobs.length === 0)
        setTitle(id)
        localStorage.setItem('project', id )
        setLoading(false)
      })();
  }, [id]);

    useEffect(() => { // Cleanup on unmount
      return () => {
        images.forEach(image => {
          if (image.revokeUrl) {
              image.revokeUrl();
          }
      });
    };
  }, [images]);

  const handleFileInput = async (e) => {
    const selectedFiles = e.target.files
    console.log(selectedFiles)
    if (!selectedFiles || selectedFiles.length === 0) return; // Early return if no files are selected
    const fileArray = Array.from(selectedFiles);
    const addBlobs = await ImageData.addImages(fileArray)
    addOrUpdateImages(addBlobs);
    setScrollDownTrigger(!scrollDownTrigger);
  };

  const addOrUpdateImages = (blobs) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((existingImage) => {
        return !blobs.some((newImage) => newImage.id === existingImage.id);
      });
      return [...updatedImages, ...blobs];
    });
  };

  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
    <MainHeader isAtTop={isAtTop} title={title} setShowDialog={setShowDialog}  />
    {loading && ( <Loader /> )}
      <>
      <div className="app-container-result result-page">
      <main ref={scrollRef} className={`content image-result ${!loading ? 'fade-in' : ''}`}>
          <div className='image-project-view'>
          {<ImageLoop ref={contentContainerRef}/> }
          </div>
      </main>
        {<ImageFooter edit={edit} project={title} handleFileInput={handleFileInput} pop={pop} showDialog={showDialog} setShowDialog={setShowDialog} /> }
      </div>
      </>

    </>
  );
};

export default ProjectView;