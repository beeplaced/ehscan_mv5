import { useState, useEffect, useRef } from 'react';
import { SVG } from '../svg/default'; const svgInst = new SVG();

const RadioButton = ({ selected, rkey }) => {
    // const [selected, setSelected] = useState(false);
    // const [on, setOn] = useState('');
    // const [off, setOff] = useState('');
    // const [selection, setSelection] = useState('');
    // const sliderBoxRef = useRef(null);


    console.log(selected)

    return (
        <>
        <div className="radio-btn" dangerouslySetInnerHTML={{ __html: svgInst.radio(selected) }} />
        </>
    );
};

export default RadioButton