import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OverlayDialog from '../dialogs/OverlayDialog';
import { ImageRenderer } from '../data/images'; const ImageData = new ImageRenderer();
import { ResultRenderer } from '../data/resultRenderer'; const ResultData = new ResultRenderer();
import { SummaryRenderer } from '../data/summaryRenderer.js'; const SummaryData =  new SummaryRenderer();
import { SVG } from '../svg/default'; const svgInst = new SVG();
import useScrollListener from '../tools/useScrollListener';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import OpacityHeader from '../elements/OpacityHeader';
//import Loader from '../tools/Loader.js';

const ProjectResult: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Access the id parameter
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [legend, setLegend] = useState('');
  const [projects, setProjects] = useState([]);
  const [inputValue, setInputValue] = useState({});
  const [title, setTitle] = useState(id);
  const [inputSha, setInputSha] = useState('');
  const { scrollRef, isAtTop } = useScrollListener();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
        console.log(isAtTop)
  }, [isAtTop]);


  useEffect(() => {
    (async () => {
    setLoading(true)
    const { projects, legend } = await SummaryData.output({project: id})
    console.log(projects)
    setProjects(projects)
    setLegend(legend)

    //setProject(await SummaryData.output({ assessment, title }))
    // const images = await classMap.get('imageRenderer').renderImagesMain()
    // setImages(images);
    setLoading(false)
    })();
      setLoaded(true)
     }, [id]);

  const btnClick = (resultIndex) => {
    console.log('click', baseData[resultIndex], resultIndex)
    const init = baseData[resultIndex]
    setInputValue(init)
    setShowDialog(true)
  }

  const closeElement = () => navigate(`/projectview/${id}`);  

  const noResults = () => {
    return (
              <>
        <div className="content-images-info images-bottom-spacer no-results">{textToken.getToken('noResult')}</div>
        </>
    )
  }

const mainElement = () => {
  return (
    <>
      <div key="summary-segment" className="summary-segment">
        {projects && projects.length > 0 ? (
          projects.map(({ status, hazard }, resultIndex) => (
            <div key={`project-${resultIndex}`} className='summary-row _element'>
              <div>{hazard}</div>
              <div dangerouslySetInnerHTML={{ __html: status }} />
            </div>

          ))
        ) : (
          <>{noResults()}</>
        )}
      </div>
    </>
  );
};


  return (
    <>
    <OpacityHeader isAtTop={isAtTop} title={title} closeElement={closeElement}/>
      <div className="app-container-result result-page">
        <main ref={scrollRef} className={`content image-result ${loaded ? 'fade-in' : ''}`}>
          {mainElement()}
        </main>
      <OverlayDialog 
      isOpen={showDialog}
      sha={inputSha}
      entryValue={inputValue}
      onClose={() => {
        setShowDialog(false)
        setDialogChanged(true)
      }
      }
      />
      <footer className="footer">
        {legend && (
          <div key="legend" dangerouslySetInnerHTML={{ __html: legend }} />
        )}</footer>
      </div>
    </>
  );
};

export default ProjectResult;