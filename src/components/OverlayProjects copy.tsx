import React, { useState, useEffect, useRef } from 'react';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import { API } from '../data/API.js'; const api = new API();
import { SVG } from '../svg/default'; const svgInst = new SVG();
import { Swiper, SwiperSlide } from 'swiper/react';
import DialogProject from '../dialogs/DialogProject';
import { useNavigate } from 'react-router-dom';
import ProjectDongle from '../components/ProjectDongle';

interface OverlayDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dialogPage: Number;
}

const OverlayDialog: React.FC<OverlayDialogProps> = ({ isOpen, onClose, dialogPage, setSortProject }) => {
const navigate = useNavigate();
const [projects, setProjects] = useState([]);
const [title, setTitle] = useState(textToken.getToken('projects'));
const [footerContent, setFooterContent] = useState('');
const swiperRef = useRef(null);
const [isAtTop, setIsAtTop] = useState(true);

const scrollRef = useRef<HTMLDivElement>(null);
const init = {
    assessment: 'risk_assessment', //Default
    title: '',
    context: '',
    activities: '',
    comment: ''
  }
const [inputValue, setInputValue] = useState(init);

  const handleScroll = () => {
    console.log('s')
    if (scrollRef.current) {
      const { scrollTop } = scrollRef.current;
      setIsAtTop(scrollTop === 0);
    }
  };

  useEffect(() => {
    const goToSlide = (index) => {
        swiperRef.current?.swiper?.slideTo(index);
    };
    goToSlide(dialogPage)
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);
      return () => {
      };
    }
  }, [isOpen]);

  const closeDialog = () => {
    onClose();
  }

  useEffect(() => {//Load Projects
    (async () => {
        const projects = await api.getProject('all')
        setProjects(projects)
        setFooterContent(dialogInfoProjects())
    })();
  }, []);

  const dialogInfoProjects = () => {
  return (
    <>
        <div className="content-info">{textToken.getToken('allProjects')}</div>
        </>
      );
  }

  const dialogInfoProject = () => {
  return (
    <>
        <div className="content-info">{textToken.getToken('allProjects')}</div>
      </>
      );
  }

  const clickEdit = (entry) => {
    console.log("clickEdit", entry);

    const pIndex = projects.findIndex(p => p.title === entry);
    if (pIndex === -1) {
      console.warn(`Project with title "${entry}" not found.`);
      return;
    }

    const { assessment, title, context, activities, comment } = projects[pIndex];

    // Initialize updatedValues with default values
    const updatedValues = {
      assessment: 'risk_assessment', // Default value
      title: '',
      context: '',
      activities: '',
      comment: '',
      ...(assessment !== undefined && { assessment }),
      ...(title !== undefined && { title }),
      ...(context !== undefined && { context }),
      ...(activities !== undefined && { activities }),
      ...(comment !== undefined && { comment }),
    };

    // Set the input value, merging with previous state
    setInputValue(prevValue => ({
      ...prevValue,
      ...updatedValues,
    }));

    console.log("Updated inputValue:", updatedValues);
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.slideTo(1); // Navigate to slide 1
      }
  };

  const clickNavigate = (title) => {
    navigate(`/project/${title}`);     
  } 

  const handleSlideChange = (swiper) => {
    const { activeIndex } = swiper
    console.log('Active Slide Index:', activeIndex);

    switch (activeIndex) {
      case 0: //edit Projects
        setTitle(textToken.getToken('projects'))
        setFooterContent(dialogInfoProjects())
        console.log('reload', init)
        setInputValue(init)
        break;
    
      case 1: //create and edit a single Project
        setTitle(`Neues Projekt anlegen`)
        setFooterContent('')
        break;
      default:
        break;
    }
  };

  const dialogProjects = () => {
    return (
      <>
      <div className='project-dongle-list'>
        {projects.map(({ title, context, comment, evidence }, index) => (
            <div className='project-dongle-list' key={index}>
              <ProjectDongle project={title} setSortProject={setSortProject}/>
            </div>

        ))}
        </div>
      </>
    );
  };

  const header = () => {
    return (
        <header className={`dialog-header ${!isAtTop ? 'shrink' : ''}`}>
          <div className='dialog-header-svg-icon' dangerouslySetInnerHTML={{ __html: svgInst.pencil() }}></div>
          <div className='header-title _t'>{isAtTop && title}</div>
          <div className="header-close" onClick={() => closeDialog()}>{textToken.getToken('close')}</div>
        </header>
    )
  };

  const body = () => {

    return (
      <>
        <div className="content-scroll">
          <Swiper 
            ref={swiperRef}
            spaceBetween={50} 
            slidesPerView={1}
            initialSlide={0}
            onSlideChange={handleSlideChange}>
            <SwiperSlide key={0}>{dialogProjects()}</SwiperSlide>
            <SwiperSlide key={1}>{<DialogProject entryValue={inputValue}/>}</SwiperSlide>
          </Swiper>
      </div>
      </>
    )
  };

  const footer = () => {
    return (
      <>
      <div className='dialog-footer'>{footerContent}</div>
      </>
    )
  };

  return (
    <>
    {isOpen && (
    <div className={`overlay-dialog ${isOpen ? 'show' : ''}`}>
    <div className="overlay-dialog-container create">
    <div className="overlay-scroll" ref={scrollRef}>
    {header()}
    {body()}
    </div>
    {footer()}
    </div>
    </div>
  )}
    </>
  );

};

export default OverlayDialog;


//remove css
  // return (
  //   <>
  //     {isOpen && (
  //       <div className={`overlay-dialog ${isOpen ? 'show' : ''}`}>
  //         <div className='overlay-container'>
  //           <div className='overlay-container-inner'>
  //           {header()}
  //           {body()}
  //           {footer()}
  //           </div>
  //         </div>
  //           {/* <div className='dialog-header opacity'>
  //               <div>{title}</div>
  //               <div onClick={() => closeDialog()}>x</div>
  //           </div>
  //           <div className='overlay-dialog-inner'>
  //           <div className="dialog-content" ref={scrollRef}>
  //           <Swiper 
  //           ref={swiperRef}
  //           spaceBetween={50} 
  //           slidesPerView={1}
  //           initialSlide={0}
  //           onSlideChange={handleSlideChange}>
  //           <SwiperSlide key={0}>{dialogProjects()}</SwiperSlide>
  //           <SwiperSlide key={1}>{<DialogProject entryValue={inputValue}/>}</SwiperSlide>
  //         </Swiper>
  //         </div>
  //         <div className='dialog-footer'>{footerContent}</div>
  //         </div> */}
  //         </div>

  //     )}
  //   </>
  // );

            // <div className="project-box" key={index}>
          //   <div className='project-content' onClick={() => clickNavigate(title)}>
          //   <div className="project-box-title">{title}</div>
          //     {context && (<div className="project-box-text">{context}</div>)}
          //     {evidence && (<div className="project-box-text">{evidence}</div>)}
          //     {comment && (<div className="project-box-text">{comment}</div>)}
          //   </div>
          //   <div className='project-edit' onClick={() => clickEdit(title)}>edit</div>
          // </div>