import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OverlayDialog from '../dialogs/OverlayDialog';
import ReEvaluateContext from '../dialogs/ReEvaluateContext';
import ResultHeader from '../elements/ResultHeader';
import { ResultRenderer } from '../data/resultRenderer'; const ResultData = new ResultRenderer();
import ResultInfo from '../components/ResultInfo';
import useScrollListener from '../tools/useScrollListener';
import ButtonRipple from '../elements/ButtonRipple';
import Popup from '../dialogs/Popup';
import CheckListItem from "../elements/CheckListItem";


import classMap from '../sharedMap';
const textToken = classMap.get('textToken');
const svgInst = classMap.get('svgInst');
const ImageData = classMap.get('ImageData');

const ImageResult: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Access the id parameter
  const [popUpType, setPopUpType] = useState('');
  const [nextID, setNextID] = useState(undefined);
  const [prevID, setPrevID] = useState(undefined);
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
  const [inputValue, setInputValue] = useState({});
  const [inputSha, setInputSha] = useState('');
  const [rerender, setRerender] = useState(false);
  const [context, setContext] = useState('');
  const [description, setDescription] = useState('');
  const { scrollRef, isAtTop } = useScrollListener({ scrollDown: false });
  const [outputHazards, setOutputHazards] = useState([]);
  //need next id available
  //      navigate(`/result/${exit}`);

    useEffect(() => { //reload on change / save / edit

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
      //Check if id exists, cause of pagination
      const res = await ImageData.imgByID(id)
      if (res.status === 204) return
      setElements(true)
      const{ imgBlob, sha, project } = res
      setImage({ imgBlob, sha })
      setInputSha(sha)
      setproject(project)

      //Grab Results
      const data = await ImageData.getImageResults(sha)
      const { Title, results } = data
      if(results && results.length > 0){
      const { hazards, result } = await ResultData.renderResult({results})
      setTitle(Title || 'Image')
      setOutputHazards(hazards)
      const { context, description } = result
      if (context) setContext(context)
      if (description) setDescription(description)
      setReEvaluate(true)
      const { prevId, nextId } = await ImageData.findNextAndPrevIds(id)//Grab prev and next
      setNextID(nextId)
      setPrevID(prevId)
      }
        //get setNextID
      setLoaded(true)
    }
    loadData()

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
            <div className='image-result-divider'></div>
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
                <div className="edit-pencil" onClick={() => btnClick(resultIndex)} dangerouslySetInnerHTML={{ __html: svgInst.pencil() }}></div>
                </div>
                </div>
                <div className='result-loop-main-text'>{maintext}</div>
                <div className='image-result-divider'></div>
                <div className='result-loop-action-row'>{action}</div>
                {safeguards && (
                  <div className='result-loop-safeguard-row'>
                    {safeguardsSplit(safeguards)}
                  </div>
                )}
                {commentElement(comment)}

                {subText && (<div className='result-loop-sub-text'>{subText}</div>)}
                {compliance && compliance.length > 0 && (<div className='result-loop-sub-text'>
                <ul>{compliance.map((c, index) => c.trim() && <li key={index}>{c.trim()}</li>)}</ul>
                </div>)}
                </div>
      </>
    )
  }

  const ulStyle = (text) => {
      return text.split('.').map((t, index) => 
        t.trim() && <li key={index}>{t.trim()}</li>
    )
  }

  const safeguardsSplit = (safeguards) => {
    return safeguards.map((safeguard, id) => {
      // Check if safeguard is an object or a string
      const txt = typeof safeguard === 'string' ? safeguard : safeguard.txt;
      const selected = typeof safeguard === 'string' ? false : safeguard.selected || false;
  
      return (
        <CheckListItem key={id} entry={{ selected, txt, id }} />
      );
    });
  };
  

  const mainTitle = () => {
    return (
      <>
                                <div className='result-loop-main-title'>
                            <div dangerouslySetInnerHTML={{ __html: svgInst.segments('ra') }}></div>
                            {textToken.getToken('riskAssessment')}</div>
      </>
    )
  }

  const mainElement = () => {
    return (<>
                {elements ? (
                  <>
                    {/* {<ProjectRoute project={project}/>} */}
                    <div className='image-result-wrapper'>
                      <div className='image-result-box'>
                        {mainTitle()}
                        <div className='image-result-box-image'>
                          {image && (
                            <img src={image.imgBlob} alt="image" data-sha={image.sha} />
                          )}
                        </div>
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
                              <div className='result-loop-sub-title'>{textToken.getToken('context')}</div>
                               <div className='result-loop-sub-wrapper'>{context}</div>
                              </>
                          )}
                          {description && (
                              <>
                              <div className='result-loop-sub-title'>{textToken.getToken('description')}</div>
                               <div className='result-loop-sub-wrapper'>{description}</div>
                              </>
                          )}
                      </div>
                    </div>
                  </>
                ) : (
                  <ResultInfo/>
                )}
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

  const closeElement = () => navigate(`/${project}`);  

  return (
    <>
    <ResultHeader isAtTop={isAtTop} title={title}
    closeElement={closeElement}
    nextElement={nextID}
    prevElement={prevID}    
    />
      <div className="app-container-result result-page">
      <main ref={scrollRef} className={`content image-result ${loaded ? 'fade-in' : ''}`}>
        {mainElement()}
        </main>
        {dialogs()}
      <footer className="footer">{tasks()}</footer>
      </div>
    </>
  );
};

export default ImageResult;

