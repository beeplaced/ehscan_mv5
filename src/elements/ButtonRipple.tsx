import { useRef } from "react";
import { SVG } from '../svg/default'; const svgInst = new SVG();
import useRipple from '../tools/useRipple';  // Import the custom hook

const ButtonRipple = ({ index, text, loader }) => {
  const buttonRef = useRef(null);
  const handleRipple = useRipple();

  const handleButtonClick = (event) => {
    handleRipple(event, buttonRef);
  };

  const inner = () => {

    switch (text) {
      case 'trash':
        return (
          <>
          <div 
          key={index} 
          ref={buttonRef} 
          className='ripple-container svg-btn-ripple' 
          onClick={handleButtonClick}
          dangerouslySetInnerHTML={{ __html: svgInst.trash_can() }}
          />
        </>
        ) 
        case 'forward':
        return (
          <>
          <div 
          key={index} 
          ref={buttonRef} 
          className='ripple-container svg-btn-ripple' 
          onClick={handleButtonClick}
          dangerouslySetInnerHTML={{ __html: svgInst.move_forward() }}
          />
        </>
        )
      default:
    return (
      <>
    <div key={index} ref={buttonRef} className='ripple-container' onClick={handleButtonClick}>
      {loader && (loaderBtn())}
      {text}</div>
      </>
    )
    }
  }

  const loaderBtn = () => {
    return (
      <>
  <div className="lds-circle"><div></div></div>
   </>
    )
  }

  return (
    <>
{inner()}
    </>
  );
};

export default ButtonRipple;
