import React, { useState, useRef } from "react";
import SwipeReveal from "../elements/SwipeReveal";
import classMap from '../sharedMap';
const svgInst = classMap.get('svgInst');
import useRipple from '../tools/useRipple';  // Import the custom hook

const CheckListItem: React.FC = ({ entry, onToggle, isSwipedOpen, setIsSwipedOpen }) => {

  const handleRipple = useRipple(); // Use the custom hook
  const buttonRef = useRef(null);
  const [selected, setSelected] = useState(entry.selected || false)
  const [content] = useState(entry)
  const [open, setOpen] = useState(false)

  const toggleCheck = (e) => {
    handleRipple(e, buttonRef);
    if (open) {
      setIsSwipedOpen(-1)
      return; //only clickable if not swipe open
    }
    const state = !selected
    setSelected(state)
    onToggle({ selected: state, id: entry.id })
  } 

  const checkListContent = (content) => {
    return (
      <div className={`info-box-content ${open ? 'open' : ''}`}>
        {content.title && (<div className="info-box-content-title">{content.title}</div>)}
        {content.txt && (<div className="result-loop-header-text">{content.txt}</div>)}
      </div>
    )
  }

  const actions = [
    { class:'camera', label: <div>add Photo</div>, onClick: () => alert("Blocked!") },
    { class:'comment', label: <div className="_svg" dangerouslySetInnerHTML={{ __html: svgInst.swipeOpenComment() }}/>, onClick: () => alert("Blocked!") },
    { class:'trash', label: <div className="_svg" dangerouslySetInnerHTML={{ __html: svgInst.swipeOpenTrash() }}/>, onClick: () => alert("Blocked!") },
  ];

  return (
    <div ref={buttonRef} className="ripple-container checkbox-ripple checkbox-row" onClick={toggleCheck}>
      <div className="checkbox-logo" dangerouslySetInnerHTML={{ __html: svgInst.checkBoxItem(selected) }}/>
      <SwipeReveal 
      index={entry.id} 
      setOpen={setOpen}
      actions={actions} 
      isSwipedOpen={isSwipedOpen}
      setIsSwipedOpen={setIsSwipedOpen}>
        {checkListContent(content)}
      </SwipeReveal>
    </div>
  );
};

export default CheckListItem;
