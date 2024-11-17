import { SVG } from '../svg/default'; const svgInst = new SVG();
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();

const AssessmentHeader: React.FC = ({ menuOpen, title, clickElement, segment }) => {

  return (
    <>
        <header className="header opacity assessment">
            <div onClick={() => clickElement('close')} dangerouslySetInnerHTML={{ __html: svgInst.segments('back') }}></div>
          <div className='header-title _t'>{title}</div>
          <div className="burger-menu-div" onClick={() => clickElement('more')} dangerouslySetInnerHTML={{ __html: svgInst.burger_menu(menuOpen) }}></div>
        </header>
        </>







  )
}

export default AssessmentHeader;


        // <header className={`header opacity ${!isAtTop ? 'shrink' : ''}`}>
        //   {isAtTop && (<div className="" dangerouslySetInnerHTML={{ __html: svgInst.segments(segment) }}></div>)}
        //   <div className='header-title _t'>{title}</div>
        //   {isAtTop && (<div className="header-close" onClick={() => closeElement()}>{textToken.getToken('close')}</div>)}
        // </header>
        // </>