import React, { useState, useEffect } from 'react';
import SwitchToggle from '../tools/SwitchToggle';
import AutoGrowingTextarea from '../tools/AutoGrowingTextarea';
import Slider from '../tools/Slider';
import { API } from '../data/API.js'; const api = new API();

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
const [hazardLvls, setHazardLvls] = useState({})

useEffect(() => {
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

  const closeDialog = () => { onClose() }

  const saveElement = async () => {

  const contentEntry = {
      ...entryValue,
      ...inputValue
  }

  const count = entryValue.c
  console.log(contentEntry, count, sha)

    const res = await api.modifyAssessmentEntry({
          count,
          sha,
          task: 'update',
          content: JSON.stringify(contentEntry),
        });
      //}
    console.log(res)

        //check save is good

        //close Dialog
        onClose()
}

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

      const { solved } = newSwitch
    console.log("solved", solved);

      setInputValue(prevState => ({
        ...prevState,
        solved: solved
        }));

    console.log("changed", inputValue);
    }

  return (
    <>
      {isOpen && (
        <div className={`overlay-dialog ${isOpen ? 'show' : ''}`}>
            <div className='overlay-dialog-inner'>
            <div className='dialog-header'>
                <div>Assessment Dialog</div>
                <div onClick={() => closeDialog()}>x</div>
            </div>
          <div className="dialog-content assessment">
            <div>Change Severity and Likelihood to adjust the Risk-Rating, add a comment and Save</div>
            <Slider min={1} max={5} step={1} title={'likelihood'} value={inputValue.likelihood} onChange={(value) => setSliderValue(value, 'likelihood')} />
            <Slider min={1} max={5} step={1} title={'severity'} value={inputValue.severity} onChange={(value) => setSliderValue(value, 'severity')} />
            <AutoGrowingTextarea
                label="Comment"
                value={inputValue.comment}
                onChange={(value) => setTextValue(value)}/>
            <SwitchToggle
            result={{ title: 'solved',
            type: 'slider',
            description: 'Safety Issue Fixed On-Site?',
            on: "The risky situation has been solved on-site",
            off: "Further action required",
            selected: inputValue.solved || false
            }} onChange={setSwitchValue} />
      </div>
            <div className='dialog-footer'>
                <div className='btn-row'>
                {!valuesEqual && (<div className='btn project' onClick={() => saveElement()}>Save Assessment</div>)}
                <div className='btn project'>rem</div>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OverlayDialog;
