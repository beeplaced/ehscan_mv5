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
  const [flicker, setFlicker] = useState(false)

  useEffect(() => {
    setInputValue(entryValue);
    console.log("Input value updated:", entryValue); // Log the new value
    setExistingProject(entryValue.title !== '')
  }, [entryValue]); // Run this effect whenever entryValue changes
  
  // New Project
  const setValue = (entry: Partial<typeof inputValue>) => {
    const newValue = {
      ...inputValue,
      ...entry
    };
    console.log(newValue);
    setInputValue(newValue);
  };

  const saveProject = async () => {
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
    console.log('s')
  }

    const footer = () => {
    return (
      <>
      <div className='dialog-footer'>
        <div className='btn-row create'>
      {existingProject && (
        <div className="svg-btn" onClick={handleButtonClick}>
        <ButtonRipple index="0" text="trash"/>
        </div>
        )}
        <div className="def-btn" onClick={() => saveProject()}>
        <ButtonRipple index="1" text={textToken.getToken('saveProject')}/>
        </div>
        {existingProject && (
        <div className="svg-btn" onClick={() => enterNewProject()}>
        <ButtonRipple index="0" text="forward"/>
        </div>
        )}


          {/* <div className={`btn change ${flicker ? '_flicker' : ''}`} onClick={() => saveProject()}>{btnTitle}</div>
                {existingProject && (
                  <>
                  <div className='btn-added'>
                  <div className='btn trash' dangerouslySetInnerHTML={{ __html: svgInst.trash_can() }}></div>
                  <div className='btn trash' onClick={() => enterNewProject()}>go</div>
                  </div>
                  </>
                  )} */}
                </div>
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
      {/* <div className='btn-row'>
      <div className='btn project' onClick={() => saveProject()}>{btnTitle}</div>
      {existingProject && (<div className='btn project' onClick={() => deleteProject()}>delete Project</div>)}
      </div> */}
    </>
  );
};

export default DialogProject;

