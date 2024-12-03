// src/Home.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import useScrollListener from '../tools/useScrollListener';
import SearchHeader from '../elements/SearchHeader';
import SearchBar from '../tools/SearchBar';
import classMap from '../sharedMap';
const ImageData = classMap.get('ImageData');
const svgInst = classMap.get('svgInst');
import ImageResultLoop from '../components/ImageResultLoop';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [title] = useState('Search');
  const [segment, setSegment] = useState('settings');
  const { scrollRef, isAtTop } = useScrollListener({ scrollDown: false });
  const [images, setImages] = useState([]);
  const closeElement = () => navigate(`/${localStorage.getItem('project')}`);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const setValue = (entry) => {
    setSearchTerm(entry);
  };

  useEffect(() => {// Load Initial

    (async () => {
      const res = await ImageData.imagesBySearchResult(searchTerm)
      setImages(res)
    })();

}, []);

  const onSearch = async () => {
    const res = await ImageData.imagesBySearchResult(searchTerm)
    console.log(res)
    setImages(res)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  }

  return (
    <>
      <SearchHeader closeElement={closeElement} segment={segment} />
      <div className="app-container-result result-page">
      <main className={`content search-result`}>
      <div className='search-bar-wrapper'>
      <div className='search-bar'>
      <div className="icon-lupe" dangerouslySetInnerHTML={{ __html: svgInst.lupe() }}/>
      <SearchBar value={searchTerm} handleKeyDown={handleKeyDown} onChange={(value) => setValue(value)} />
      </div>
      </div>
      <div className='image-project-view' ref={scrollRef}>
          { images.length === 0 ? ( <div className='no-results'>Nothing here yet, upload Image</div> ) : (  
          <> {<ImageResultLoop searchTerm={searchTerm} loading={loading} projectFlow={true} images={images} setImages={setImages} /> }
          </>
        ) }
        </div>
        </main>
      <footer className="footer"></footer>
      </div>
    </>
  );
};

export default Settings;

