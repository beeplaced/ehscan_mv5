import React, { useState, useEffect } from "react";

import classMap from '../sharedMap';
const svgInst = classMap.get('svgInst');

const CheckListItem: React.FC = ({ entry, onToggle, open }) => {

  const [selected, setSelected] = useState(entry.selected || false)
  const [content] = useState(entry)

  useEffect(() => {
    console.log(open)
  }, [open]);

  const toggleCheck = () => {
    const state = !selected
    setSelected(state)
    onToggle({ selected: state, id: entry.id })
  }

  

  return (
    <div className="checkbox-row" onClick={() => toggleCheck()}>
      <div className="checkbox-logo" dangerouslySetInnerHTML={{ __html: svgInst.checkBoxItem(selected) }}/>
      <div className="info-box-content">
        {content.title && (<div className="info-box-content-title">{content.title}</div>)}
        {content.txt && (<div className="result-loop-header-text">{content.txt}</div>)}
      </div>
    </div>
  );
};

export default CheckListItem;
