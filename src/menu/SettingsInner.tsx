import React, { useState, useRef } from 'react';
import DropDownMenu from '../tools/DropDownMenu';
import SwitchToggle from '../tools/SwitchToggle';
import { useParams, useNavigate } from 'react-router-dom';
const retrievedSettings = localStorage.getItem('settings');
const settingsObj = JSON.parse(retrievedSettings); // Convert back to object
console.log(settingsObj)
import classMap from '../sharedMap';
const textToken = classMap.get('textToken');
const svgInst = classMap.get('svgInst');

import useRipple from '../tools/useRipple';  // Import the custom hook

const SettingsInner: React.FC = () => {

const buttonRef = useRef(null);
const [settingsObject, setSettingsObject] = useState(settingsObj);
  const navigate = useNavigate();

const onChange = (newSettings) => {
    console.log("changed", newSettings);

    // Validate newSettings
    if (typeof newSettings !== 'object' || newSettings === null) {
        console.error("Invalid newSettings: must be a non-null object");
        return; // Early exit if newSettings is invalid
    }

    // Validate specific properties if needed
    const validKeys = ['darkmode', 'imagerepeat', 'projectflow', 'lang'];
    for (const key in newSettings) {
        if (!validKeys.includes(key)) {
            console.warn(`Invalid setting key: ${key}`);
            return; // Early exit if an invalid key is found
        }

        // Additional type checks (if necessary)
        switch (key) {
            case 'darkmode':
                if (typeof newSettings[key] !== 'boolean') {
                    console.error("Invalid value for darkmode: must be a boolean");
                    return;
                }
                break;
            case 'imagerepeat':
                if (typeof newSettings[key] !== 'number' || newSettings[key] < 0) {
                    console.error("Invalid value for imagerepeat: must be a non-negative number");
                    return;
                }
                break;
            case 'projectflow':
                if (typeof newSettings[key] !== 'boolean') {
                    console.error("Invalid value for projectflow: must be a boolean");
                    return;
                }
                break;
            case 'lang':
                if (typeof newSettings[key] !== 'string' || newSettings[key].length === 0) {
                    console.error("Invalid value for lang: must be a non-empty string");
                    return;
                }
                break;
            default:
                break; // No additional checks needed for other properties
        }
    }

    // Merge settings
    const updatedSettings = {
        ...settingsObj,
        ...newSettings // This will overwrite properties from existing settings
    };

    console.log(updatedSettings);
    localStorage.setItem('settings', JSON.stringify(updatedSettings));
};

const handleRipple = useRipple(); // Use the custom hook

const handleButtonClick = (event) => {
    console.log('a')
    handleRipple(event, buttonRef);
    navigate(`/account/`); 
  };

return (
<>
<main className="content settings">

<div ref={buttonRef} className='ripple-container settings-box-ripple switch-element' onClick={handleButtonClick}>
    <div className='user-circle'>cd</div>
    <div className='switch-element-inner'>
        <div className='switch-element-inner-title'>CD</div>
        <div>carsten@ehscan.com</div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: svgInst.move_forward() }}></div>
        </div>


<div className='settings-box'>
<div className='settings-box-title'>Image View</div>
{/* <SwitchToggle result={{ title: 'projectflow',
            type: 'slider',
            description: 'Images to be shown',
            on: "as a constant flow of images",
            off: "divided by project",
            selected: settingsObject.projectflow
        }} onChange={onChange} /> */}
<SwitchToggle result={{ title: 'sortby',
            type: 'slider',
            description: 'Define Sort Order of Images',
            on: "date",
            off: "-",
            selection: [
                {tag: 'byid', txt: 'by id'}, 
                {tag: 'byscore', txt: 'by score'},
                {tag: 'bydate', txt: 'by date'}
            ],
            selected: settingsObject.sortby
        }} onChange={onChange} /> 
    <div className='settings-element _element'>
    <div className='settings-element-text'>Images to be diplayed in a row</div>
    <DropDownMenu result={{
            title: 'imagerepeat',
            selected: settingsObject.imagerepeat
        }} onChange={onChange} />
    </div>
</div>
<div className='settings-box'>
<div className='settings-box-title'>General Settings</div>
    <SwitchToggle result={{
            title: 'darkmode',
            type: 'slider',
            description: 'Modus',
            off: "lightmode",
            on: "darkmode",
            selected: settingsObject.darkmode
        }} onChange={onChange} />
</div>
</main>
      </>
  );
};

export default SettingsInner;
