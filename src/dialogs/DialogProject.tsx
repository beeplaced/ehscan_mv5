import React, { useState, useEffect } from 'react';
import FloatingLabelInput from '../tools/FloatingLabelInput';
import AutoGrowingTextarea from '../tools/AutoGrowingTextarea';
import { API } from '../data/API.js'; const api = new API();
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import { SVG } from '../svg/default'; const svgInst = new SVG();
import ButtonRipple from '../elements/ButtonRipple';

interface OverlayDialogProps {

}

const DialogProject: React.FC<OverlayDialogProps> = ({ entryValue, setNewProject, setDialogClose }) => {
  const [existingProject, setExistingProject] = useState(false);
  const [btnTitle, setBtnTitle] = useState(textToken.getToken('saveProject'));
  const [inputValue, setInputValue] = useState(entryValue);

  useEffect(() => {
    setInputValue(entryValue);
    setExistingProject(entryValue.title !== '')
  }, [entryValue]); // Run this effect whenever entryValue changes
  
  const setValue = (entry: Partial<typeof inputValue>) => {
    const newValue = {
      ...inputValue,
      ...entry
    };
    setInputValue(newValue);
  };

  const createProject = async () => {
      if (inputValue.title === '') {
      alert('add Title')
      return
    }
    const res = await api.setProject(inputValue)
    
    if (![200, 201].includes(res.status)) {
      alert('Something went wrong, try again');
      return;
    }
    const { title } = inputValue
    setNewProject(title)
    setDialogClose(true)
  }

  const saveProject = async () => {
    return
    console.log(inputValue)

    if (inputValue.title === '') {
      alert('add Title')
      return
    }
    const res = await api.setProject(inputValue)
    console.log(res)

    // if (![200, 201].includes(res.status)) {
    //   //Wrong
    //   return
    // }

    const { title } = inputValue
    setNewProject(title)
    setExistingProject(true)
    setBtnTitle(textToken.getToken('editProject'))
  }

  const enterNewProject = () => {
    setDialogClose(true)
  }

  const deleteProject = () => {
    console.log('deleteProject')
  }

  // Existing Project

  const existingProjectTitle = () => {
    return (
      <>
      <div className='dialog-content-project-title'>
        <div dangerouslySetInnerHTML={{ __html: svgInst.segments('ra') }}></div>
        <div>{inputValue.title}</div>
      </div>
      </>
    )
  }

  const handleButtonClick = () => {
    console.log('handleButtonClick')
  }

    const footer = () => {
    
    return (
      <>
      <div className='dialog-footer'>
      {existingProject ? (<>
        <div className='btn-row edit'>
        <div className="svg-btn" onClick={handleButtonClick}>
        <ButtonRipple index="0" text="trash"/>
        </div>
        <div className="def-btn" onClick={() => saveProject()}>
        <ButtonRipple index="1" text={textToken.getToken('saveProject')}/>
        </div>
        <div className="svg-btn" onClick={() => enterNewProject()}>
        <ButtonRipple index="0" text="forward"/>
        </div>
        </div>
      </>) : (
      <>
      <div className='btn-row create'>
        <div className="small-btn" onClick={() => createProject()}>
        <ButtonRipple index="1" text={textToken.getToken('saveProject')}/>
        </div>
      </div>    
      </>)}
      </div>
      </>
    )
  };

  return (
    <>
    {!existingProject  ? (
      <FloatingLabelInput 
        label="Title"
        value={inputValue.title}
        onChange={(value) => setValue({ title: value })} 
      /> ): (existingProjectTitle())}
      <FloatingLabelInput
        label="Context"
        value={inputValue.context}
        onChange={(value) => setValue({ context: value })} 
      />
      <FloatingLabelInput
        label="Activities"
        value={inputValue.activities}
        onChange={(value) => setValue({ activities: value })} 
      />
      <AutoGrowingTextarea
        label="Comment"
        value={inputValue.comment}
        onChange={(value) => setValue({ comment: value })} 
      />
      {footer()}
    </>
  );
};

export default DialogProject;

