import React, { useState, useEffect, useRef } from 'react';
import SwitchToggle from '../tools/SwitchToggle';
import AutoGrowingTextarea from '../tools/AutoGrowingTextarea';
import Slider from '../tools/Slider';
import { API } from '../data/API.js'; const api = new API();
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import { SVG } from '../svg/default'; const svgInst = new SVG();
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
const [isAtTop, setIsAtTop] = useState(true);
const scrollRef = useRef<HTMLDivElement>(null);

  //logic
  useEffect(() => {
    let valEntry = {
      ...entryValue
    }
    if (entryValue.comment) valEntry.comment = entryValue.comment.comment
    setValInputValue(valEntry)
    setInputValue(valEntry);
  }, [entryValue]);

    useEffect(() => {
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

  console.log(contentEntry, entryValue, inputValue)

  const { comment, checked, severity, risk_rating, likelihood } = contentEntry

  const content = { comment, checked, severity, risk_rating, likelihood }

  const count = entryValue.c
  console.log(comment, checked, severity, likelihood, count, sha)

  const res = await api.modifyAssessmentEntry({
          count,
          sha,
          task: 'update',
          content: JSON.stringify(content),
        });
      //}
    console.log(res)

        //check save is good

        //close Dialog
  onClose()
  };

    // Handler to update the slider values
  const setSliderValue = (value, name) => {
        setInputValue(prevState => ({
            ...prevState,
            [name]: value,
            risk_rating: inputValue.severity * inputValue.likelihood
        }));
  };

    // Handler to update the comment value
  const setTextValue = (value) => {
        setInputValue(prevState => ({
            ...prevState,
            comment: value
        }));
  };

  const setSwitchValue = (newSwitch) => {

      const { checked } = newSwitch
    console.log("checked", checked);

      setInputValue(prevState => ({
        ...prevState,
        checked: checked
        }));

    console.log("changed", inputValue);
  };

  //scroll
  const handleScroll = () => {
    console.log('s')
    if (scrollRef.current) {
      const { scrollTop } = scrollRef.current;
      setIsAtTop(scrollTop === 0);
    }
  };


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);

      return () => {
        if (scrollRef.current) {
          //scrollRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [isOpen]);

  const closeDialog = () => { onClose(); }

  useEffect(() => {//Load Projects
    (async () => {
    })();
  }, []);

  const header = () => {
    return (
        <header className={`dialog-header ${!isAtTop ? 'shrink' : ''}`}>
          <div className='header-title _t'>{isAtTop && inputValue.title}</div>
          <div className="header-close" onClick={() => closeDialog()}>{textToken.getToken('close')}</div>
        </header>
    )
  };

  const body = () => {

    return (
      <>
      <div className="content-scroll">
          <div className="dialog-content assessment">
            <div>Change Severity and Likelihood to adjust the Risk-Rating, add a comment and Save</div>
            <Slider min={1} max={5} step={1} title={'likelihood'} value={inputValue.likelihood} onChange={(value) => setSliderValue(value, 'likelihood')} />
            <Slider min={1} max={5} step={1} title={'severity'} value={inputValue.severity} onChange={(value) => setSliderValue(value, 'severity')} />
            <AutoGrowingTextarea
                label="Comment"
                value={inputValue.comment}
                onChange={(value) => setTextValue(value)}/>
            <SwitchToggle
            result={{ title: 'checked',
            type: 'slider',
            description: 'Safety Issue Fixed On-Site',
            selected: inputValue.checked || false
            }} onChange={setSwitchValue} />
      </div>
      </div>
      </>
    )
  };

  const footer = () => {
    return (
      <>
      <div className='dialog-footer'>
        <div className='btn-row'>
        <div className="svg-btn">
        <ButtonRipple index="0" text="trash"/>
        </div>
        <div className="def-btn" onClick={() => saveElement()}>
        <ButtonRipple index="1" text={textToken.getToken('editHazard')}/>
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
