import classMap from '../sharedMap';
const textToken = classMap.get('textToken');
const svgInst = classMap.get('svgInst');

import { useNavigate } from 'react-router-dom';


const OpacityHeader: React.FC = ({ isAtTop, title, closeElement, nextElement, prevElement }) => {
  const navigate = useNavigate();
  
  const pagination = (element) => {
     navigate(`/result/${element}`);  
  }

  return (
    <>
        <header className={`header opacity result ${!isAtTop ? 'shrink' : ''}`}>
          {isAtTop && (
            <div className="header-close" onClick={() => closeElement()}>{textToken.getToken('close')}</div>
            )}
          <div className='header-title _t'>{title}</div>
          {isAtTop && (
            <>
            {prevElement ? (
              <div onClick={() => pagination(prevElement)} dangerouslySetInnerHTML={{ __html: svgInst.segments('back') }}></div>
            ) : (
            <>
            <div></div>
            </>)}
            {nextElement ? (
              <div onClick={() => pagination(nextElement)} dangerouslySetInnerHTML={{ __html: svgInst.segments('forward') }}></div>
            ) : (
            <>
            <div></div>
            </>)}
            </>
            )}       
        </header>
        </>
  )
}

export default OpacityHeader;
