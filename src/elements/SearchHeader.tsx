import { SVG } from '../svg/default'; const svgInst = new SVG();
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();

const SearchHeader: React.FC = ({ closeElement }) => {

  return (
    <>
        <header className={`header search`}>
          <div className='header-title _t'>SearchResults</div>
          <div className="header-close" onClick={() => closeElement()}>{textToken.getToken('close')}</div>
        </header>
        </>
  )
}

export default SearchHeader;
