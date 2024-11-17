import { useState, useEffect, useRef } from 'react';
import { SVG } from '../svg/default'; const svgInst = new SVG();
import RadioButton from '../tools/RadioButton';

const SwitchToggle = ({ result, onChange }) => {
    const [selected, setSelected] = useState(false);
    const [selTag, setSelTag] = useState('');
    const [on, setOn] = useState('');
    const [off, setOff] = useState('');
    const [selection, setSelection] = useState('');
    const sliderBoxRef = useRef(null);

    useEffect(() => {

        console.log(result.selected)
        if (result.selected) setSelTag(result.selected)
        setSelected(result.selected === false ? false : true)
    }, [result.selected]);

    useEffect(() => {
        setOn(result.on || '');
        setOff(result.off || '');
        if (result.selection) setSelection(result.selection)
    }, [result]);

    const sliderBoxFlicker = () => {
        if (sliderBoxRef.current){
        sliderBoxRef.current.classList.add('slider-box-flicker');
        setTimeout(() => {
          sliderBoxRef.current.classList.remove('slider-box-flicker');
        }, 120);
        }
    }

    const deactivate = (title) => {
        setSelected(false);
        switch (true) { case title === 'darkmode':
            document.body.classList.remove('darkmode')
        }
        console.log('Deactivate slider', localStorage);
    };

    const activate = (title) => {
        setSelected(true);
        switch (true) { case title === 'darkmode':
            document.body.classList.add('darkmode')
        }
        console.log('Activate slider', localStorage);
    };  

    const handleClick = async () => {
        console.log(result)
        const { title } = result
        sliderBoxFlicker();
        let newData
        if (selected === true) {
            newData = false//{ title, selected: 0 };
            deactivate(title);
        } else {
            newData = true//{ title, selected: 1 };
            activate(title);
        }
        // if (settingsObject[title] != undefined){ All handled externally
        //     settingsObject[title] = newData
        //     localStorage.setItem('settings', JSON.stringify(settingsObject)); // Convert to string
        //     //console.log(localStorage)
        // }
        if (onChange) {//external Call
            onChange({[result.title]: newData});
        }
    };


const selectionElement = () => {//RADIO
    return (
        <>
            {selection.map(({tag, txt}, index) => (
                <div className="switch-selection" key={index}>
                    <RadioButton selected={tag === selTag} rkey={index}/>
                    {txt}</div>
            ))}
        </>
    );
};

    return (
        <>
        <div className="slider _element" onClick={handleClick}>
        <div className="slider-txt">
            <div className='slider-txt-title'>{result.description}</div>
            {selected && (
                <>
                {selectionElement()}
                </>
            )}



            {/* <div className='slider-txt-toggle'>{selected === true ? on : off}</div> */}
            </div>
            <div className="slider-wrapper">
                <div className="_sliderbox" ref={sliderBoxRef}>
                    <div className={`slider-box-outer ${selected === true ? 'deactivate-sliderbox' : ''}`}>
                        <div className="slider-box-inner">
                            <div className={`slider-ball ${selected === true ? 'activate-slider' : 'deactivate-slider'}`}>
                                {selected === true && ( <div dangerouslySetInnerHTML={{ __html: svgInst.check_small() }} />)}
                                </div></div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
};

export default SwitchToggle