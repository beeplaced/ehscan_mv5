import { SVG } from '../svg/default'; const svgInst = new SVG();
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();

const MainHeader: React.FC = ({ isAtTop, title }) => {

  return (
    <>
        <header className={`header opacity main ${!isAtTop ? 'shrink' : ''}`}>
          {isAtTop && (<div className="" dangerouslySetInnerHTML={{ __html: svgInst.segments('project') }}></div>)}
          <div className='header-title _t'>{title}</div>
        </header>
        </>
  )
}

export default MainHeader;
