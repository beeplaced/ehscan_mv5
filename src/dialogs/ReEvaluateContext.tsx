import React, { useState, useEffect, useRef } from 'react';
import AutoGrowingTextarea from '../tools/AutoGrowingTextarea';
import { API } from '../data/API.js'; const api = new API();
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import ButtonRipple from '../elements/ButtonRipple';

interface OverlayDialogProps {
  isOpen: boolean;
  entryValue: Array<T>;
  sha: String;
  onClose: () => void;
}

const OverlayDialog: React.FC<OverlayDialogProps> = ({ isOpen, entryValue, sha, onClose }) => {

const [inputValue, setInputValue] = useState(entryValue);
const [valInputValue, setValInputValue] = useState({});
const [valuesEqual, setValuesEqual] = useState(true);
const [title, setTitle] = useState('Re-Evaluate');
const [isAtTop, setIsAtTop] = useState(true);
const scrollRef = useRef<HTMLDivElement>(null);

  //logic
  useEffect(() => {

    console.log(entryValue)

    let valEntry = {
      ...entryValue
    }
    if (entryValue.comment) valEntry.comment = entryValue.comment.comment
    setValInputValue(valEntry)
    setInputValue(valEntry);
  }, [entryValue]);

    useEffect(() => {
    //console.log("Input value updated:", inputValue, entryValue); // Log the new value
    const equal = deepEqual(inputValue,valInputValue)
    setValuesEqual(equal)
  }, [inputValue]);

  const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true; // Identical objects are equal

    // Check if both inputs are objects (and not null)
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    // Check if both objects have the same number of keys
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;

    // Check each key and value recursively
    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
  };

  const saveElement = async () => {


  const contentEntry = {
      ...entryValue,
      ...inputValue
  }

    console.log(contentEntry, sha)

    const { context } = contentEntry

    const res = await api.setTask({context, sha});
      //}
    console.log(res)

  //check save is good

  //close Dialog
  onClose('savedTask')
  };

    // Handler to update the comment value
  const setTextValue = (value) => {
        setInputValue(prevState => ({
            ...prevState,
            context: value
        }));
  };

  // //scroll
  // const handleScroll = () => {
  //   console.log('s')
  //   if (scrollRef.current) {
  //     const { scrollTop } = scrollRef.current;
  //     setIsAtTop(scrollTop === 0);
  //   }
  // };


  // useEffect(() => {
  //   if (scrollRef.current) {
  //     scrollRef.current.addEventListener('scroll', handleScroll);

  //     return () => {
  //       if (scrollRef.current) {
  //         //scrollRef.current.removeEventListener('scroll', handleScroll);
  //       }
  //     };
  //   }
  // }, [isOpen]);

  const closeDialog = () => { onClose('justSave'); }

  const header = () => {
    return (
        <header className={`dialog-header ${!isAtTop ? 'shrink' : ''}`}>
          <div className='header-title _t'>{isAtTop && title}</div>
          <div className="header-close" onClick={() => closeDialog()}>{textToken.getToken('close')}</div>
        </header>
    )
  };

  const body = () => {

    return (
      <>
      <div className="content-scroll">
          <div className="dialog-content assessment">
            <div>Update context and review the image based on the latest information provided.</div>
            <AutoGrowingTextarea
                label="Focus on..."
                value={inputValue.context}
                onChange={(value) => setTextValue(value)}/>
      </div>
      </div>
      </>
    )
  };

    const footer = () => {
    return (
      <>
      <div className='dialog-footer'>
        <div className='btn-row-single'>
        <div className="small-btn" onClick={() => saveElement()}>
        <ButtonRipple index="1" text={textToken.getToken('evaluateTask')}/>
        </div>
        </div>
        </div>
      </>
    )
  };

  return (
    <>
    {isOpen && (
    <div className={`overlay-dialog ${isOpen ? 'show' : ''}`}>
    <div className="overlay-dialog-container mid">
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
