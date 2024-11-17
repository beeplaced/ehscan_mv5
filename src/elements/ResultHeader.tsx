import { SVG } from '../svg/default'; const svgInst = new SVG();
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();

const OpacityHeader: React.FC = ({ isAtTop, title, closeElement }) => {

  return (
    <>
        <header className={`header opacity result ${!isAtTop ? 'shrink' : ''}`}>
          {isAtTop && (
            <>
            <div onClick={() => closeElement()} dangerouslySetInnerHTML={{ __html: svgInst.segments('back') }}></div>
            <div dangerouslySetInnerHTML={{ __html: svgInst.segments('ra') }}></div>
            </>
            )}
          <div className='header-title _t'>{title}</div>
          {/* {isAtTop && (<div className="header-close" onClick={() => closeElement()}>{textToken.getToken('close')}</div>)} */}
        </header>
        </>
  )
}

export default OpacityHeader;
