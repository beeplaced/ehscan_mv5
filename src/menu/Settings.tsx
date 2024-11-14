import React, { useState, useEffect } from 'react';
import DropDownMenu from '../tools/DropDownMenu';
import SwitchToggle from '../tools/SwitchToggle';
const retrievedSettings = localStorage.getItem('settings');
const settingsObj = JSON.parse(retrievedSettings); // Convert back to object
console.log(settingsObj)
const Settings: React.FC = () => {

const [settingsObject, setSettingsObject] = useState(settingsObj);

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

return (
<>
<main className="content settings">
<div className='settings-box'>
<div className='settings-box-title'>Image View</div>
<SwitchToggle result={{ title: 'projectflow',
            type: 'slider',
            description: 'Images to be shown',
            on: "as a constant flow of images",
            off: "divided by project",
            selected: settingsObject.projectflow
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

export default Settings;
