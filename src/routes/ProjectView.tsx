import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageRenderer } from '../data/images'; const ImageData = new ImageRenderer();
import useScrollListener from '../tools/useScrollListener';
import MainHeader from '../elements/MainHeader';
import ImageFooter from '../components/ImageFooter';
import ImageLoop from '../components/ImageLoop';
import Loader from '../tools/Loader';

//const ProjectView: React.FC = () => {
  const ProjectView = () => {
  const { id } = useParams<{ id: string }>(); // Access the id parameter
  const contentContainerRef = useRef<HTMLDivElement>(null)
  const [title, setTitle] = useState('');
  const [scrollDownTrigger, setScrollDownTrigger] = useState(false);
  const { scrollRef, isAtTop } = useScrollListener({ scrollDown: true, scrollDownTrigger });
  const [loading, setLoading] = useState(false);
  const [pop, setPop] = useState(false);
  const [edit, setEdit] = useState(false);
  const [images, setImages] = useState([]);
  const [itemsToSync, setItemsToSync] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [incompleteItems, setIncompleteItems] = useState([]);
  
  useEffect(() => {//Load Initial
      (async () => {
        setLoading(true)
        localStorage.setItem('project', id )
        const blobs = await ImageData.loadProjectImages(id)
        setPop(blobs.length === 0)
        setImages(blobs);
        setTitle(id)
        setLoading(false)
      })();
     }, [id]);

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
    // Loop through each new image and check if its id already exists in prevImages
    const updatedImages = prevImages.filter((existingImage) => {
      // Keep the existing image only if its id is not in the new blobs
      return !blobs.some((newImage) => newImage.id === existingImage.id);
    });
    // Append the new images to the end of the updated array
    return [...updatedImages, ...blobs];
  });
};

  return (
    <>
    <MainHeader isAtTop={isAtTop} title={title}/>
    {loading && ( <Loader /> )}
      <>
      <div className="app-container-result result-page">
      <main ref={scrollRef} className={`content image-result ${!loading ? 'fade-in' : ''}`}>
          <div className='image-project-view'>
          {<ImageLoop
          ref={contentContainerRef}
          images={images}
          incompleteItems={incompleteItems}
          itemsToSync={itemsToSync}/> }
          </div>
      </main>
        {<ImageFooter edit={edit} project={title} handleFileInput={handleFileInput} pop={pop}/> }
      </div>
      </>

    </>
  );
};

export default ProjectView;