import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageRenderer } from '../data/images'; const ImageData = new ImageRenderer();
import { ResultRenderer } from '../data/resultRenderer'; const ResultData = new ResultRenderer();
import { SummaryRenderer } from '../data/summaryRenderer.js'; const SummaryData =  new SummaryRenderer();
import useScrollListener from '../tools/useScrollListener';
import AssessmentHeader from '../elements/AssessmentHeader';
import Loader from '../tools/Loader';
import HazardSegmentDongle from '../elements/HazardSegmentDongle';
import FloatingActionButtons from '../elements/FloatingActionButtons';
import classMap from '../sharedMap';
const textToken = classMap.get('textToken');

const ProjectResult: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Access the id parameter
  const navigate = useNavigate();
  const [legend, setLegend] = useState('');
  const [projects, setProjects] = useState([]);
  const [inputValue, setInputValue] = useState({});
  const [title, setTitle] = useState(id);
  const [inputSha, setInputSha] = useState('');
  const { scrollRef, isAtTop } = useScrollListener({ scrollDown: false });
  const [loading, setLoading] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    (async () => {
    setLoading(true)
    const { projects, legend } = await SummaryData.output({project: id})
    console.log(projects)
    setProjects(projects)
    setLegend(legend)

    // setProject(await SummaryData.output({ assessment, title }))
    // const images = await classMap.get('imageRenderer').renderImagesMain()
    // setImages(images);
    setLoading(false)
  })();

     }, [id]);

  const btnClick = (resultIndex) => {
    console.log('click', baseData[resultIndex], resultIndex)
    const init = baseData[resultIndex]
    setInputValue(init)
    setShowDialog(true)
  }

  const clickElement = (type) => {

    switch (type) {
      case 'more':
        setIsFabOpen(isFabOpen ? false : true)
        break;
    
      default:
        navigate(`/${id}`);  
        break;
    }


      console.log('btn')
    
   // navigate(`/${id}`);  



  }

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
          projects.map((entry, index) => (
            <div className='project-dongle-list' key={index}>
                <HazardSegmentDongle entry={entry} project={id}/>
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
    <AssessmentHeader menuOpen={isFabOpen} title={title} clickElement={clickElement} segment="assessment_chart"/>
    <FloatingActionButtons isOpen={isFabOpen} setShowDialog={setShowDialog} setIsOpen={setIsFabOpen} project={id} type="assessment" position="top" />
    {loading ? ( <Loader /> ) : (
    <>
      <div className="app-container-result result-page">
        <main ref={scrollRef} className={`content image-result ${!loading ? 'fade-in' : ''}`}>
          {mainElement()}
        </main>
      <footer className="footer">
        {legend && (
          <div key="legend" dangerouslySetInnerHTML={{ __html: legend }} />
        )}</footer>
      </div>
        </>
      )}
    </>
  );
};

export default ProjectResult;