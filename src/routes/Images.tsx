import React, { useEffect, useRef, useState } from 'react';
import ImageBox from '../components/ImageBox';
import ImageFooter from '../components/ImageFooter';
import ImageHeaderButton from '../components/ImageHeaderButton';
import OverlayProjects from '../components/OverlayProjects';
import { useNavigate } from 'react-router-dom';

const Images: React.FC = () => {
  const fileInputRef = useRef(null);
  const [headerTop, setHeaderTop] = useState(false)
  const [showDialog, setShowDialog] = useState(false);
  const [dialogPage, setDialogPage] = useState(0);
  const [edit, setEdit] = useState(false);
  const [selBtnType, setSelBtnType] = useState('select');
  const navigate = useNavigate();

  const onButtonClick = (type) => { //header Button - show all projects
    console.log(type)
    switch (type) {
      case 'select':
        setEdit(true)
        setSelBtnType('cancel')
        break;
      case 'cancel':
        setSelBtnType('select')
        setEdit(false)
        break;
      case 'projects':
        setDialogPage(0)
        setShowDialog(true)
        break;
      default:
        break;
    }

    console.log(type)

  }

  const onFooterClick = (type) => {//footer Button - new Project
    console.log(type)

    switch (type) {
      case 'deleteSelected':
      case 'analyzeSelected':
        setImgBoxAction(type)
        break;
      case 'imgButton':
        fileInputRef?.current?.click();
        break;
      case 'addProject':
        setDialogPage(1)
        setShowDialog(true)
        break;     
      default://menu
        navigate('/menu');
        break;
    }

    // setDialogPage(1)
    // setShowDialog(true)
  }

  const [imgBoxAction, setImgBoxAction] = useState('');

  const [sortProject, setSortProject] = useState('');

    useEffect(() => {
      console.log(sortProject)
      if (sortProject === '') return
      setShowDialog(false)
  }, [sortProject]);

  return (
    <>
    <main className='image-var'>
    <div className={headerTop ? 'image-header top' : 'image-header'}>
      <div className='image-header-text'></div>
      <div className='image-header-action'>
      {/* {<ImageHeaderButton type={'projects'} onClick={onButtonClick}/>} */}
      {<ImageHeaderButton type={selBtnType} onClick={onButtonClick}/>}
      {/* {headerTop ? <ImageHeaderButton type="down" /> : <ImageHeaderButton type="up" />} */}
      {/* {<ImageHeaderButton type={'search'}/>} */}
      </div>
    </div>
      <div className="app-container-images">
        <ImageBox
        edit={edit}
        fileInputRef={fileInputRef}
        setHeaderTop={setHeaderTop} 
        imgBoxAction={imgBoxAction}
        sortProject={sortProject}
        onButtonClick={onButtonClick}
        />
      {<ImageFooter edit={edit} footerClick={onFooterClick} /> }
      </div>
      </main>
      {showDialog ? <OverlayProjects isOpen={showDialog} dialogPage={dialogPage} onClose={() => setShowDialog(false)} setSortProject={setSortProject}/> : ''}
      </>
  );
};

export default Images;
