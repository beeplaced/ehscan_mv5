import { SVG } from '../svg/default'; const svgInst = new SVG();
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();

const OpacityHeader: React.FC = ({ isAtTop, title, closeElement, segment = 'ra_overview' }) => {

  return (
    <>
        <header className={`header opacity ${!isAtTop ? 'shrink' : ''}`}>
          {isAtTop && (<div className="" dangerouslySetInnerHTML={{ __html: svgInst.segments(segment) }}></div>)}
          <div className='header-title _t'>{title}</div>
          {isAtTop && (<div className="header-close" onClick={() => closeElement()}>{textToken.getToken('close')}</div>)}
        </header>
        </>
  )
}

export default OpacityHeader;
