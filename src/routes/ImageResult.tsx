import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import OverlayDialog from '../dialogs/OverlayDialog';
import ReEvaluateContext from '../dialogs/ReEvaluateContext';
import ResultHeader from '../elements/ResultHeader';
import { ImageRenderer } from '../data/images'; const ImageData = new ImageRenderer();
import { ResultRenderer } from '../data/resultRenderer'; const ResultData = new ResultRenderer();
import { SVG } from '../svg/default'; const svgInst = new SVG();
import ResultInfo from '../components/ResultInfo';
import useScrollListener from '../tools/useScrollListener';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import ButtonRipple from '../elements/ButtonRipple';
import Popup from '../dialogs/Popup';


const ImageResult: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Access the id parameter
  const swiperRef = useRef<HTMLDivElement>(null);
  const [popUpType, setPopUpType] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const closePopup = () => setIsPopupOpen(false);
  const [showDialog, setShowDialog] = useState(false);
  const [reValue, setReVal] = useState({ context: '' });
  const [showReval, setShowReval] = useState(false);
  const [dialogChanged, setDialogChanged] = useState(false);
  const navigate = useNavigate();
  const [project, setproject] = useState('');
  const [image, setImage] = useState({});
  const [reEvaluate, setReEvaluate] = useState(false);
  const [title, setTitle] = useState('Results');
  const [elements, setElements] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [outputResults, setOutputResults] = useState([]);
  const [baseData, setBaseData] = useState([]);
  const contentRef = useRef(null);
  const [inputValue, setInputValue] = useState({});
  const [inputSha, setInputSha] = useState('');
  const [rerender, setRerender] = useState(false);
  const [context, setContext] = useState('');
  const [description, setDescription] = useState('');
  const { scrollRef, isAtTop } = useScrollListener({ scrollDown: false });
  const [outputHazards, setOutputHazards] = useState([]);
  
  const handleSlideChange = (swiper) => {
    if (!id) return;

    const currentId = parseInt(id);
    let exit = currentId;

    if (swiper.activeIndex === 0 && currentId > 0) {
      exit = currentId - 1;
    } else if (swiper.activeIndex === 2) {
      exit = currentId + 1;
    }

    if (exit !== currentId) {
      navigate(`/result/${exit}`);
    }
  };

    useEffect(() => {
        console.log(isAtTop)
  }, [isAtTop]);

    useEffect(() => {

      console.log(dialogChanged)

      if (dialogChanged){
        const reloadData = async () => {
            setRerender(true);
            const minDuration = new Promise(resolve => setTimeout(resolve, 500));
            const data = await ImageData.getImageResults(inputSha);
            const { results } = data;
            const renderedResult = await ResultData.renderResult({ results });
            const { outputResults, baseData } = renderedResult;
            setOutputResults(outputResults);
            setBaseData(baseData);
            await minDuration;
            setRerender(false);
            setDialogChanged(false)
        };
      reloadData()
      }
  }, [dialogChanged]);


  useEffect(() => { // init
    const loadData = async () => {
      setLoaded(false)
      //load Image Data
      const res = await ImageData.imgByID(id)
      if (res.status === 204) return
      setElements(true)
      console.log(res)
      const{ imgBlob, sha, project } = res
      setImage({ imgBlob, sha })
      setInputSha(sha)
      setproject(project)

      //Grab Results
      const data = await ImageData.getImageResults(sha)
      console.log(data)
      const { Title, results } = data
        if(results && results.length > 0){
        const { hazards, result } = await ResultData.renderResult({results})
        console.log( hazards, result )
        if (Title) setTitle(Title)
        setOutputHazards(hazards)
        const { context, description } = result
        if (context) setContext(context)
        if (description) setDescription(description)
        setReEvaluate(true)
        }
      setLoaded(true)
    }

    if (swiperRef.current) {
      loadData()
      swiperRef.current.slideTo(1, 0); // Instantly reset to index 1
    }
  }, [id]);

  const btnClick = (resultIndex) => {
    console.log('click', outputHazards[resultIndex])
    // const init = baseData[resultIndex]
    setInputValue(outputHazards[resultIndex])
    setShowDialog(true)
  }

  const btnRevalClick = () => {
        setTimeout(() => { setShowReval(true) }, 200);
  }

  const closeElement = () => navigate(`/${project}`);  

  const noResults = () => {
    return (<>
        <div className="content-images-info images-bottom-spacer">{textToken.getToken('noResult')}</div>
        </>)
  }

  const commentElement = (comment) => {
    return (
      <>
        {comment && (
            <>
            <div className='comment-wrapper'>
              <div className='comment-main'>
                <div dangerouslySetInnerHTML={{ __html: svgInst.comment() }}></div>
                <div className='comment-text'>{comment.comment}</div>
                </div>
                <div className='datetime-token'>{comment.timestamp}</div>
              </div>
              </>
          )}
      </>
    )
  }

  const assessmentElement = (element, resultIndex) => {

    const { ratingClr, title, subTitle, maintext, subText, comment, compliance, checked, action, safeguards } = element
    return (
      <>
      <div className='result-loop-main-wrapper'>
        <div className='result-loop-header'>
          <div className='result-loop-header-rating'>
          <div
            className='quick-result-ball'
            style={{ backgroundColor: ratingClr }}
            {...(checked && { dangerouslySetInnerHTML: { __html: svgInst.assessments('check') } })}>
          </div>
            </div>
            <div className='result-loop-header-text'>
              <div className='result-loop-header-text-title'>{title}</div>
              <div className='result-loop-header-text-sub'>{subTitle}</div>
              </div>
              <div className='result-loop-header-edit'>
                <div onClick={() => btnClick(resultIndex)} dangerouslySetInnerHTML={{ __html: svgInst.pencil() }}></div>
                </div>
                </div>
                <div className='result-loop-action-row'>{action}</div>
                {safeguards && (
                  <div className='result-loop-safeguard-row'>
                    <ul>
                      {safeguards.split('.').map((safeguard, index) => 
                        safeguard.trim() && <li key={index}>{safeguard.trim()}</li>
                      )}
                    </ul>
                  </div>
                )}
                <div className='result-loop-main-text'>{maintext}</div>
                {commentElement(comment)}
                </div>
                {subText && (<div className='result-loop-sub-text'>{subText}</div>)}
                {compliance && (<div className='result-loop-sub-text'>{compliance}</div>)}
      </>
    )
  }

  const mainElement = () => {
    return (<>
        <SwiperSlide key={1}>
                {elements ? (
                  <>
                    {/* {<ProjectRoute project={project}/>} */}
                    <div className='image-result-wrapper'>
                      <div className='image-result-box'>
                        <div className='image-result-box-image'>
                          {image && (
                            <img src={image.imgBlob} alt="image" data-sha={image.sha} />
                          )}
                        </div>
                          <div className='result-loop-main-title'>{textToken.getToken('riskAssessment')}</div>
                          {outputHazards && outputHazards.length > 0 ? (
                            outputHazards.map((result, resultIndex) => (
                              <React.Fragment key={resultIndex}>
                                {assessmentElement(result, resultIndex)}
                              </React.Fragment>
                            ))
                          ) : (
                            <>
                              {noResults()}
                            </>
                          )}

                          {context && (
                              <>
                              <div className='result-loop-main-title'>{textToken.getToken('context')}</div>
                               <div className='result-loop-sub-wrapper'>
                              {context}
                              </div>
                              </>
                          )}
                          {description && (
                              <>
                              <div className='result-loop-main-title'>{textToken.getToken('description')}</div>
                               <div className='result-loop-sub-wrapper'>
                              {description}
                              </div>
                              </>
                          )}

                        {/* <div className='results-segments'>
                          {outputResults && outputResults.length > 0 ? (
                            outputResults.map((result, resultIndex) => (
                              <div 
                                className={`${rerender ? 'fade-out' : 'fade-in'}`}
                                ref={contentRef} 
                                key={resultIndex} 
                                dangerouslySetInnerHTML={{ __html: result }}
                                onClick={ () => btnClick(resultIndex) }
                              />
                            ))
                          ) : (
                            <>
                            {noResults()}
                            </>
                          )}
                        </div> */}
                      </div>
                    </div>
                  </>
                ) : (
                  <ResultInfo/>
                )}
              </SwiperSlide>
    </>)
  }

  const dialogs = () => {
    return (<>
      <OverlayDialog //Edit Assessment
      isOpen={showDialog}
      sha={inputSha}
      entryValue={inputValue}
      onClose={() => {
        setShowDialog(false)
        setDialogChanged(true)
      }
      }
      />
      <ReEvaluateContext 
      isOpen={showReval}
      sha={inputSha}
      entryValue={reValue}
      onClose={(entry) => {
        setShowReval(false)
        if (entry === 'justSave') return
        setPopUpType(entry)
        setIsPopupOpen(true)
      }
      }
      />
      <Popup isOpen={isPopupOpen} onClose={closePopup} type={popUpType}/>
    </>)
  }

  const tasks = () => {
    return (
    <>
    <div className='results-segments'>
    {reEvaluate && (
      <div className='btn-row-center'>
        <div className="footer-btn" onClick={() => btnRevalClick()}>
        <ButtonRipple index="1" text={textToken.getToken('reEval')}/>
        </div>
        </div>
      )}
    </div></>
    )
  }

  return (
    <>
    <ResultHeader isAtTop={isAtTop} title={title} closeElement={closeElement}/>
      <div className="app-container-result result-page">
      <main ref={scrollRef} className={`content image-result ${loaded ? 'fade-in' : ''}`}>
          <Swiper 
            key={id}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={50} 
            slidesPerView={1}
            initialSlide={1}
            effect='flip'
            onSlideChange={handleSlideChange}
            >
            <SwiperSlide key={0}/>
            {mainElement()}
            <SwiperSlide key={2}></SwiperSlide>
          </Swiper>
        </main>
        {dialogs()}
      <footer className="footer">{tasks()}</footer>
      </div>
    </>
  );
};

export default ImageResult;

